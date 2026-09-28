import React, { useState } from 'react';

export default function Programs() {
  const [activeFilter, setActiveFilter] = useState('All');
  const programs = [
    {
      id: 1,
      title: "Software Engineering & Web Development",
      category: "Degree",
      duration: "3 Years",
      tuition: "650,000 RWF / Sem",
      status: "Open for Admission",
      description: "Master full-stack programming, database architectures, and cloud structures using global development standards.",
      skills: ["React", "Node.js", "SQL", "Cloud DevOps"]
    },
    {
      id: 2,
      title: "Network Security & Cyber Intelligence",
      category: "Diploma",
      duration: "2 Years",
      tuition: "500,000 RWF / Sem",
      status: "Open for Admission",
      description: "Build robust defensive security systems, inspect network vulnerabilities, and learn safe modern encryption frameworks.",
      skills: ["Cisco Routing", "Ethical Hacking", "Linux Systems"]
    },
    {
      id: 3,
      title: "Graphic Design & Interactive Multimedia",
      category: "Certification",
      duration: "6 Months",
      tuition: "250,000 RWF",
      status: "Filling Fast",
      description: "Hone creative UI/UX designs, digital media generation layouts, and professional corporate digital branding techniques.",
      skills: ["Photoshop", "Figma", "Illustrator", "UI/UX"]
    },
    {
      id: 4,
      title: "Data Analytics & Business Intelligence",
      category: "Degree",
      duration: "3 Years",
      tuition: "700,000 RWF / Sem",
      status: "Open for Admission",
      description: "Transform complex raw numerical variables into visual corporate performance engines and actionable data dashboards.",
      skills: ["Python Data", "Tableau", "Excel", "Machine Learning"]
    },
    {
      id: 5,
      title: "Embedded Systems & IoT Engineering",
      category: "Diploma",
      duration: "2 Years",
      tuition: "550,000 RWF / Sem",
      status: "Closed",
      description: "Design automated microcontrollers, smart sensory devices, and interconnected physical hardware automation systems.",
      skills: ["C++ Coding", "Arduino", "Robotics", "Sensors"]
    },
    {
      id: 6,
      title: "Cloud Computing Architectures",
      category: "Certification",
      duration: "4 Months",
      tuition: "300,000 RWF",
      status: "Open for Admission",
      description: "Deep dive into secure cloud service infrastructure hosting models, serverless operations, and scalable app load balancing.",
      skills: ["AWS Setup", "Docker Containers", "Kubernetes"]
    }
  ];


  const filters = ['All', 'Degree', 'Diploma', 'Certification'];

  const filteredPrograms = activeFilter === 'All' 
    ? programs 
    : programs.filter(prog => prog.category === activeFilter);

  return (
    <section className="min-h-screen bg-slate-150 px-4 py-16 text-slate-100 font-sans antialiased">
      <div className="mx-auto max-w-7xl">
        
   
        <div className="mb-12 border-b border-slate-800 pb-8 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              CodeBridge Academy Directory
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
              Available <span className="italic text-emerald-400">Programs.</span>
            </h1>
            <p className="mt-3 text-lg text-slate-400 max-w-xl">
              Accelerate your technical acumen with curriculum pathways engineered for the modern industrial workforce.
            </p>
          </div>
          
         
          
        </div>

      
      </div>
    </section>
  );
}
