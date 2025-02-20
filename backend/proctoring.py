import sys
import cv2
import mediapipe as mp
import torch
import requests
import warnings
import json

warnings.filterwarnings("ignore", category=FutureWarning)  # Suppress warnings

# Load YOLOv5 for object detection (phone detection)
phone_detector = torch.hub.load("ultralytics/yolov5", "yolov5s", pretrained=True)

# Load MediaPipe Face Detection model
mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)

# Load MediaPipe Hands for Hand Detection
mp_hands = mp.solutions.hands
hand_detector = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Function to download video from Cloudinary
def download_video(cloudinary_url, save_path="downloaded_video.mp4"):
    response = requests.get(cloudinary_url, stream=True)
    if response.status_code == 200:
        with open(save_path, "wb") as video_file:
            for chunk in response.iter_content(chunk_size=1024):
                video_file.write(chunk)
        return save_path
    return None

# Function to analyze cheating behavior
def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    suspicious_frames = 0
    feedback_set = set()  

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break  

        frame_count += 1
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Face detection
        face_results = face_detection.process(rgb_frame)

        if not face_results.detections:
            feedback_set.add("No face detected in some frames.")
            suspicious_frames += 1
            continue  

        face_count = len(face_results.detections)
        if face_count > 1:
            feedback_set.add("Multiple faces detected in some frames.")
            suspicious_frames += 1

        # Face movement detection (head turning more than 45 degrees)
        eyes_center = []
        for detection in face_results.detections:
            keypoints = detection.location_data.relative_keypoints
            eyes_center.append(((keypoints[0].x + keypoints[1].x) / 2, (keypoints[0].y + keypoints[1].y) / 2))

        if len(eyes_center) > 0:
            avg_eye_x = sum(e[0] for e in eyes_center) / len(eyes_center)
            head_rotation_degrees = abs((avg_eye_x - 0.5) * 180)

            if head_rotation_degrees > 45:
                feedback_set.add("Candidate turned head significantly (more than 45 degrees).")
                suspicious_frames += 1

        # Object detection (detect mobile phone)
        phone_results = phone_detector(frame)
        for *xyxy, conf, cls in phone_results.xyxy[0]:
            label = phone_detector.names[int(cls)]
            if label == "cell phone" and conf > 0.5:
                feedback_set.add("Mobile phone detected in some frames.")
                suspicious_frames += 1

        # Hand movement detection
        hand_results = hand_detector.process(rgb_frame)
        if hand_results.multi_hand_landmarks:
            feedback_set.add("Suspicious hand movement detected.")
            suspicious_frames += 1

    cap.release()

    # Calculate score out of 5
    score = max(0, 5 * (1 - (suspicious_frames / frame_count))) if frame_count > 0 else 0

    # Convert feedback list to a single string
    feedback_string = ", ".join(feedback_set) if feedback_set else "No suspicious activity detected."

    # Generate JSON output
    output_json = json.dumps({
        "Score": round(score, 2),  # Keep 2 decimal places
        "Feedback": feedback_string
    })

    print(output_json)
    sys.stdout.flush()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python proctoring.py <cloudinary_video_url>"}))
        sys.stdout.flush()
        sys.exit(1)

    cloudinary_url = sys.argv[1]  
    downloaded_video = download_video(cloudinary_url)

    if downloaded_video:
        analyze_video(downloaded_video)
    else:
        print(json.dumps({"error": "Video download failed."}))
        sys.stdout.flush()
