import React, { useState } from 'react';

const FormSection = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    schoolAddress: '',
    permanentAddress: '',
    summary: '',
    education: [
      {
        institution: '',
        location: '',
        degree: '',
        extra: '',
        gpa: '',
        honors: '',
      },
    ],
    experience: [
      { role: '', company: '', location: '', duration: '', details: '' },
    ],
    projects: [{ name: '', description: '' }],
    achievements: [{ title: '', description: '' }],
    skills: [],
  });

  // Handle input change
  const handleChange = (e, index, section, field) => {
    const newData = { ...formData };

    if (Array.isArray(newData[section])) {
      newData[section][index][field] = e.target.value;
    } else {
      newData[section] = e.target.value;
    }

    setFormData(newData);
    onUpdate(newData);
  };

  // Handle array additions
  const addField = (section, emptyData) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: [...prevData[section], emptyData],
    }));
  };

  return (
    <form
      className="max-w-4xl mx-auto border-2 border-black bg-white p-6 shadow-md rounded-lg space-y-4"
    >
      {/* Personal Info */}
      <h2 className="text-xl font-bold border-b pb-1">Personal Information</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={e => handleChange(e, null, 'name')}
        className="input-field"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={e => handleChange(e, null, 'email')}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Mobile"
        value={formData.mobile}
        onChange={e => handleChange(e, null, 'mobile')}
        className="input-field"
      />

      {/* Summary */}
      <h2 className="text-xl font-bold border-b pb-1">Summary</h2>
      <textarea
        placeholder="Write a brief summary (Optional). It will be AI generated if you choose not to."
        value={formData.summary}
        onChange={e => handleChange(e, null, 'summary')}
        className="input-field"
        rows={6}
      />

      {/* Skills */}
      <h2 className="text-xl font-bold border-b pb-1">Skills</h2>
      <input
        type="text"
        placeholder="Skills (comma-separated)"
        value={formData.skills.join(', ')}
        onChange={e => {
          setFormData({
            ...formData,
            skills: e.target.value.split(',').map(skill => skill.trim()),
          });
          onUpdate({
            ...formData,
            skills: e.target.value.split(',').map(skill => skill.trim()),
          });
        }}
        className="input-field"
      />

      {/* Education */}
      <h2 className="text-xl font-bold border-b pb-1">Education</h2>
      {formData.education.map((edu, index) => (
        <div key={index} className="space-y-2">
          <input
            type="text"
            placeholder="Institution"
            value={edu.institution}
            onChange={e => handleChange(e, index, 'education', 'institution')}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Location"
            value={edu.location}
            onChange={e => handleChange(e, index, 'education', 'location')}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Degree"
            value={edu.degree}
            onChange={e => handleChange(e, index, 'education', 'degree')}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Honors"
            value={edu.honors}
            onChange={e => handleChange(e, index, 'education', 'honors')}
            className="input-field"
          />
          <input
            type="text"
            placeholder="GPA"
            value={edu.gpa}
            onChange={e => handleChange(e, index, 'education', 'gpa')}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Extra (Optional)"
            value={edu.extra}
            onChange={e => handleChange(e, index, 'education', 'extra')}
            className="input-field"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          addField('education', {
            institution: '',
            location: '',
            degree: '',
            extra: '',
            gpa: '',
            honors: '',
          })
        }
        className="btn-add"
      >
        + Add Education
      </button>

      {/* Experience */}
      <h2 className="text-xl font-bold border-b pb-1">Experience</h2>
      {formData.experience.map((exp, index) => (
        <div key={index} className="space-y-2">
          <input
            type="text"
            placeholder="Role"
            value={exp.role}
            onChange={e => handleChange(e, index, 'experience', 'role')}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={e => handleChange(e, index, 'experience', 'company')}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Location"
            value={exp.location}
            onChange={e => handleChange(e, index, 'experience', 'location')}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Duration"
            value={exp.duration}
            onChange={e => handleChange(e, index, 'experience', 'duration')}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Details"
            value={exp.details}
            onChange={e => handleChange(e, index, 'experience', 'details')}
            className="input-field"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          addField('experience', {
            role: '',
            company: '',
            location: '',
            duration: '',
            details: '',
          })
        }
        className="btn-add"
      >
        + Add Experience
      </button>

      {/* Achievements */}
      <h2 className="text-xl font-bold border-b pb-1">Key Achievements</h2>
      {formData.achievements.map((ach, index) => (
        <div key={index} className="space-y-2">
          <input
            type="text"
            placeholder="Achievement Title"
            value={ach.title}
            onChange={e => handleChange(e, index, 'achievements', 'title')}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            value={ach.description}
            onChange={e =>
              handleChange(e, index, 'achievements', 'description')
            }
            className="input-field"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addField('achievements', { title: '', description: '' })}
        className="btn-add"
      >
        + Add Achievement
      </button>

      {/* Projects */}
      <h2 className="text-xl font-bold border-b pb-1">Projects</h2>
      {formData.projects.map((proj, index) => (
        <div key={index} className="space-y-2">
          <input
            type="text"
            placeholder="Project Name"
            value={proj.name}
            onChange={e => handleChange(e, index, 'projects', 'name')}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            value={proj.description}
            onChange={e => handleChange(e, index, 'projects', 'description')}
            className="input-field"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addField('projects', { name: '', description: '' })}
        className="btn-add"
      >
        + Add Project
      </button>

      {/* Submit Button */}
      {/* <button type="submit" className="btn-submit">
        Generate Resume
      </button> */}
    </form>
  );
};

export default FormSection;
