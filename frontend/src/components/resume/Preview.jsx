import React from 'react';

const Section = ({ title, content }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold border-b-2 border-gray-500 pb-3">
      {title}
    </h2>
    <div className="mt-2">{content}</div>
  </div>
);

const Preview = ({ data }) => {
  //   const data = {
  //     name: 'Matt Smith',
  //     email: 'student@wharton.upenn.edu',
  //     mobile: '(919) 555-1212',
  //     schoolAddress:
  //       'Harnwell College House, 3820 Locust Walk MB 261, Philadelphia, PA 19104',
  //     permanentAddress: '11 Palm Lane, Umm Suqeim 3, Dubai, U.A.E.',
  //     summary:
  //       'Results-driven Computer Science student with a strong foundation in software engineering, finance, and management. Passionate about problem-solving, AI/ML, and full-stack development. Experienced in building scalable web applications and working with startups to drive growth through technology.',
  //     education: [
  //       {
  //         institution:
  //           'University of Pennsylvania, Jerome Fisher Program in Management and Technology',
  //         location: 'Philadelphia, PA',
  //         degree: 'BSE in Computer Science, Minor in Mathematics',
  //         extra: 'BS in Economics, Concentrations in Finance and Management',
  //         gpa: '3.72/4.00',
  //         honors: 'Wharton Dean’s List & Engineering Dean’s List (May 20xx)',
  //       },
  //     ],
  //     achievements: [
  //       {
  //         title: 'Winner - AI Hackathon 2024',
  //         description:
  //           'Developed an AI-powered chatbot for mental health support, winning 1st place in a national hackathon.',
  //       },
  //       {
  //         title: 'Google Developer Student Clubs Lead',
  //         description:
  //           'Led a team of developers, organized workshops on web and AI technologies, and mentored students.',
  //       },
  //       {
  //         title: 'Best Use of OpenAI API - PennApps',
  //         description:
  //           "Built an AI resume generator using OpenAI's GPT model, receiving special recognition for innovation.",
  //       },
  //       {
  //         title: 'Dean’s List - University of Pennsylvania',
  //         description:
  //           'Recognized for outstanding academic performance with a GPA of 3.72/4.00.',
  //       },
  //       {
  //         title: 'Finalist - International Coding Championship',
  //         description:
  //           'Ranked among the top 50 in an international competitive programming contest.',
  //       },
  //     ],
  //     experience: [
  //       {
  //         role: 'Consultant',
  //         company: 'Wharton Small Business Development Center',
  //         location: 'Philadelphia, PA',
  //         duration: 'October 20xx - Present',
  //         details: [
  //           'Consulted for a real estate appraisal management software company ($7MM annual revenue) and identified new revenue streams.',
  //           'Analyzed market space for commercial real estate appraisal software and estimated a $30MM revenue opportunity.',
  //           'Developed an Excel-based sales tool to help clients understand the economic value of automation in real estate appraisals.',
  //         ],
  //       },
  //     ],
  //     projects: [
  //       {
  //         name: 'AI Resume Builder',
  //         description:
  //           'Developed an AI-powered resume generator using React and OpenAI API, allowing users to create tailored resumes dynamically.',
  //       },
  //       {
  //         name: 'E-Commerce Platform',
  //         description:
  //           'Built a full-stack e-commerce application using the MERN stack with Stripe payment integration and real-time order tracking.',
  //       },
  //     ],
  //     skills: ['Java', 'C', 'Python', 'React', 'Node.js', 'MongoDB'],
  //   };

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 shadow-md font-serif">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-lg">
          {data.email} | {data.mobile}
        </p>
        <p className="text-gray-600">{data.schoolAddress}</p>
        <p className="text-gray-600">{data.permanentAddress}</p>
      </div>

      {/* Sections */}
      <Section
        title="SUMMARY"
        content={<p className="text-gray-700">{data.summary}</p>}
      />

      <Section
        title="SKILLS"
        content={<p className="text-gray-700">{data.skills.map(skill => skill.name).join(' | ')}</p>}
      />

      <Section
        title="EDUCATION"
        content={data.education.map((edu, index) => (
          <div key={index} className="mt-2">
            <p className="font-bold">
              {edu.institution} - {edu.location}
            </p>
            <p className="italic">{edu.degree}</p>
            <p className="text-gray-600">{edu.extra}</p>
            <p className="text-gray-600">
              GPA: {edu.gpa} | Honors: {edu.honors}
            </p>
          </div>
        ))}
      />

      <Section
        title="PROFESSIONAL EXPERIENCE"
        content={data.experience.map((exp, index) => (
          <div key={index} className="mt-2">
            <p className="font-bold">
              {exp.role} - {exp.company}
            </p>
            <p className="text-gray-600">
              {exp.location} ({exp.duration})
            </p>
            <ul className="list-disc list-inside text-gray-700">
              {exp.details}
            </ul>
          </div>
        ))}
      />

      <Section
        title="KEY ACHIEVEMENTS"
        content={data.achievements.map((ach, index) => (
          <div key={index} className="mt-2">
            <span className="font-bold">({index + 1})</span>
            <span className="font-bold ml-2">{ach.title}</span>
            <p className="text-gray-600">{ach.description}</p>
          </div>
        ))}
      />

      <Section
        title="PROJECTS"
        content={data.projects.map((project, index) => (
          <div key={index} className="mt-2">
            <span className="font-bold">({index + 1})</span>
            <span className="font-bold ml-2">{project.name}</span>
            <p className="text-gray-700">{project.description}</p>
          </div>
        ))}
      />
    </div>
  );
};

export default Preview;
