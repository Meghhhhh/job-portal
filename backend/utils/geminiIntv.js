// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
//   } = require("@google/generative-ai");

import { GoogleGenerativeAI } from "@google/generative-ai";
  
  const apiKey = process.env.GEMINI_API_KEY_INTV;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", 
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  export async function run(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "You are mock interview taker for me. When i give you input of single skill for eg c or cpp or java etc any such 1 skill it can be any tech skill, you will generate json array of 5 questions for me. ques should be of subjective type testing thorough knowledge of user. \n\nwhen i give u array of projects as i/p you will generate 5 ques in the json format subj type based on what person has worked on. for ex i say i worked on scaling x feature . so u can ask ques related to that\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand. I will act as a mock interview taker. You provide me with:\n\n*   **Scenario 1: A Single Technical Skill** (e.g., \"C++\", \"Python\", \"React\", \"SQL\")\n\n*   **Scenario 2: A List/Description of Projects and Your Contributions** (e.g., \"Developed a REST API using Spring Boot\", \"Scaled feature X by implementing caching\", \"Designed a relational database schema for Y\")\n\nBased on your input, I will generate a JSON array containing 5 subjective-type interview questions designed to assess your thorough knowledge.\n\n**Important Considerations:**\n\n*   **Subjective Questions:**  The questions will be open-ended and require you to demonstrate in-depth understanding, problem-solving skills, and experience. I will try to avoid simple \"definition\" questions.\n*   **Real-World Application:** I will tailor the questions to explore how you have applied your knowledge in practical scenarios.\n*   **Deeper Understanding:** The questions will be designed to probe beyond superficial understanding.\n*   **JSON Format:**  The output will be a valid JSON array.\n\nLet's start!  What would you like to start with? A single skill or a project description?\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "for the skills i will also pass along a level like 1,2,3 so esy med hard and based on that keep level of ques accordingly\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand. Now I will accept two inputs:\n\n*   **A Single Technical Skill** (e.g., \"C++\", \"Python\", \"React\", \"SQL\")\n*   **Difficulty Level (1-3)**:  1 = Easy, 2 = Medium, 3 = Hard\n\nI will adjust the difficulty of the questions based on the level you provide.\n\nReady when you are. What skill and difficulty level do you want me to use?\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "skill:[c++] level[1]\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"question_id\": 1,\n    \"question\": \"Describe the difference between `malloc` and `new` in C++. When would you prefer to use one over the other, and why?\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 2,\n    \"question\": \"Explain the concept of pointers in C++. How are they declared and used? Give a simple example.\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 3,\n    \"question\": \"What are the differences between `struct` and `class` in C++? How does the default access specifier differ between the two?\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 4,\n    \"question\": \"Describe the purpose of header files in C++. What are they used for, and why are they important for code organization?\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 5,\n    \"question\": \"Explain what is meant by pass by value and pass by reference in C++. What are the benefits and drawbacks of each method?\",\n    \"skill\": \"C++\",\n    \"level\": 1\n  }\n]\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "alright this is perfect give it in the same json format with this 4 fields always question_id, question, skill, level. always stick to this format no matter what\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Understood. I will adhere strictly to the following JSON format for every response:\n\n```json\n[\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  },\n  {\n    \"question_id\": integer,\n    \"question\": string,\n    \"skill\": string,\n    \"level\": integer\n  }\n]\n```\n\nI will ensure each object in the array contains those four fields ( `question_id`, `question`, `skill`, `level`), with the appropriate data types.\n\nOkay, I'm ready for your next skill and level, or the project description.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "project[\"developed rest api using mern stack\", \"worked on auth feature in project\"]\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"question_id\": 1,\n    \"question\": \"Describe the overall architecture of the REST API you developed using the MERN stack. What were the key components and how did they interact?\",\n    \"skill\": \"MERN Stack\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 2,\n    \"question\": \"Explain the specific technologies you used for each layer of the MERN stack (MongoDB, Express.js, React, Node.js). What were the main reasons for choosing these technologies over alternatives?\",\n    \"skill\": \"MERN Stack\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 3,\n    \"question\": \"Discuss the authentication methods you implemented for the project. What security considerations did you take into account, and how did you address them?\",\n    \"skill\": \"Authentication\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 4,\n    \"question\": \"Describe any challenges you faced while developing the REST API and/or the authentication feature. How did you overcome them?\",\n    \"skill\": \"Problem Solving\",\n    \"level\": 2\n  },\n  {\n    \"question_id\": 5,\n    \"question\": \"How did you handle state management in your React application? Explain your choice of state management library or approach and why it was suitable for this project.\",\n    \"skill\": \"React\",\n    \"level\": 2\n  }\n]\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Now listen very carefully when you generate questions right after that prompt if I ever give you an array of answers likw {\n\"ansswer_id\":1\n\"answer\":\"i developed rest api using crud method . it interacted with cart\",\n\"ansswer_id\":2\n\"answer\":\"i developed rest api using crud method . it interacted with cart\",\n\"ansswer_id\":3\n\"answer\":\"i developed rest api using crud method . it interacted with cart\",\n\"ansswer_id\":4\n\"answer\":\"i developed rest api using crud method . it interacted with cart\",\n\"ansswer_id\":5\n\"answer\":\"i developed rest api using crud method . it interacted with cart\",\n}\n\nYou will return me again an array of 5 elements having marks for the answer of each questionthe questions you gave me ok. u have to give marks for each ques out of 10 rating user based highly on correctness, accuracy, uniqueness, broadness of answer. also see how is ccritical thinking of user. based on all this give rating."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand the new instructions.\n\n1.  **You provide the initial input** (Skill + Level OR Project Description(s)).\n2.  **I generate a JSON array of 5 questions** (with `question_id`, `question`, `skill`, `level`).\n3.  **You provide a JSON array of 5 answers** to those questions, structured like this:\n\n```json\n{\n\"answers\": [\n  {\n    \"answer_id\": 1,\n    \"answer\": \"Your answer to question 1\"\n  },\n  {\n    \"answer_id\": 2,\n    \"answer\": \"Your answer to question 2\"\n  },\n  {\n    \"answer_id\": 3,\n    \"answer\": \"Your answer to question 3\"\n  },\n  {\n    \"answer_id\": 4,\n    \"answer\": \"Your answer to question 4\"\n  },\n  {\n    \"answer_id\": 5,\n    \"answer\": \"Your answer to question 5\"\n  }\n  ]\n}\n```\n\n4.  **I will then generate a JSON array of 5 ratings (out of 10)** for each answer, based on the following criteria:\n\n    *   **Correctness:** Is the answer factually accurate and technically sound?\n    *   **Accuracy:** Does the answer directly address the question and avoid irrelevant information?\n    *   **Uniqueness:** Does the answer demonstrate original thought or insight beyond basic knowledge?\n    *   **Breadth:** Does the answer showcase a comprehensive understanding of the topic and related concepts?\n    *   **Critical Thinking:** Does the answer demonstrate the ability to analyze, evaluate, and synthesize information?\n\nThe JSON output for the ratings will be in this format:\n\n```json\n{\n  \"ratings\": [\n    {\n      \"answer_id\": 1,\n      \"rating\": integer (out of 10)\n    },\n    {\n      \"answer_id\": 2,\n      \"rating\": integer (out of 10)\n    },\n    {\n      \"answer_id\": 3,\n      \"rating\": integer (out of 10)\n    },\n    {\n      \"answer_id\": 4,\n      \"rating\": integer (out of 10)\n    },\n    {\n      \"answer_id\": 5,\n      \"rating\": integer (out of 10)\n    }\n  ]\n}\n```\n\nI am ready for your next input. Shall we proceed?\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "skill:python\nlevel:1\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"question_id\": 1,\n    \"question\": \"What are the key differences between a list and a tuple in Python? When would you choose one over the other?\",\n    \"skill\": \"Python\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 2,\n    \"question\": \"Explain what is meant by 'dynamic typing' in Python. What are the advantages and disadvantages of this feature?\",\n    \"skill\": \"Python\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 3,\n    \"question\": \"Describe the purpose of the `if __name__ == '__main__':` block in Python. Why is it used?\",\n    \"skill\": \"Python\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 4,\n    \"question\": \"What are Python decorators? Give a simple example of how you might use a decorator.\",\n    \"skill\": \"Python\",\n    \"level\": 1\n  },\n  {\n    \"question_id\": 5,\n    \"question\": \"Explain what list comprehension is in Python, and provide a simple example of how it can be used to create a new list.\",\n    \"skill\": \"Python\",\n    \"level\": 1\n  }\n]\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "[\n  {\n    \"answer_id\": 1,\n    \"answer\": \"Lists and tuples are both used to store collections of items in Python, but they have key differences. Lists are mutable, meaning their elements can be changed, added, or removed, while tuples are immutable, meaning they cannot be modified after creation. Lists are typically used when the data needs to be updated, whereas tuples are used for fixed data to ensure integrity and performance benefits.\"\n  },\n  {\n    \"answer_id\": 2,\n    \"answer\": \"Dynamic typing in Python means that the type of a variable is determined at runtime rather than being explicitly declared. This allows flexibility and faster development but can lead to runtime errors and unexpected behavior if variable types change unintentionally. It also requires extra care when handling variable assignments.\"\n  },\n  {\n    \"answer_id\": 3,\n    \"answer\": \"The `if __name__ == '__main__':` block ensures that a script runs only when executed directly and not when imported as a module in another script. It is used to define entry points in Python programs, allowing reusable code while preventing unintended execution.\"\n  },\n  {\n    \"answer_id\": 4,\n    \"answer\": \"A Python decorator is a function that modifies the behavior of another function or method without changing its code. Decorators are commonly used for logging, access control, and performance measurement. Example:\\n\\n```python\\n  def decorator(func):\\n      def wrapper():\\n          print('Before function execution')\\n          func()\\n          print('After function execution')\\n      return wrapper\\n\\n  @decorator\\n  def say_hello():\\n      print('Hello!')\\n\\n  say_hello()\\n```\\nThis outputs:\\n```\\nBefore function execution\\nHello!\\nAfter function execution\\n```\"\n  },\n  {\n    \"answer_id\": 5,\n    \"answer\": \"List comprehension is a concise way to create lists in Python using a single line of code. It provides a more readable and efficient alternative to using loops. Example:\\n\\n```python\\n  numbers = [1, 2, 3, 4, 5]\\n  squares = [x**2 for x in numbers]\\n  print(squares)  # Output: [1, 4, 9, 16, 25]\\n```\\nThis generates a list of squares from an existing list.\"\n  }\n]\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"ratings\": [\n    {\n      \"answer_id\": 1,\n      \"rating\": 9\n    },\n    {\n      \"answer_id\": 2,\n      \"rating\": 8\n    },\n    {\n      \"answer_id\": 3,\n      \"rating\": 7\n    },\n    {\n      \"answer_id\": 4,\n      \"rating\": 10\n    },\n    {\n      \"answer_id\": 5,\n      \"rating\": 9\n    }\n  ]\n}\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "when you see answers in my prompt it means u have to rate my answers ok\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Understood. I will always remember that when you provide answers after the questions, my role is to rate them according to the specified criteria. I will only generate new questions when you specifically ask for them, or when the previous set of questions have been answered. I'm ready for the next set of questions or another set of answers to rate, whichever you prefer.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "when i pass skill/project generate questions when i pass answers rate them as per above criterias we discussed"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Perfect. I am now operating in that mode. Pass me either a skill/project description for question generation, or an \"answers\" JSON payload for rating.\n"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
    return result.response.text();
  }
  
 // run();
