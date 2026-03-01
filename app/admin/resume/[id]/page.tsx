"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, ArrowLeft, FileDown } from "lucide-react";

interface BulletItem {
    bullets: string[];
    // Mengganti any dengan string | string[] atau unknown
    [key: string]: string | string[] | undefined; 
  }

export default function ResumeFormPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  // State Management
  const [resumeName, setResumeName] = useState("My New Resume");
  const [fullName, setFullName] = useState("");
  const [summary, setSummary] = useState("");
  const [contacts, setContacts] = useState([{ label: "Email", value: "", url: "" }]);
  const [experiences, setExperiences] = useState([{ company: "", role: "", period: "", bullets: [""] }]);
  const [projects, setProjects] = useState([{ title: "", category: "", bullets: [""] }]);
  const [education, setEducation] = useState([{ institution: "", degree: "", period: "", bullets: [""] }]);
  const [skillGroups, setSkillGroups] = useState([{ category: "", summary: "" }]);
  const [certifications, setCertifications] = useState([""]);

  // Fetch Data jika Mode Edit
  useEffect(() => {
    if (!isNew) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/${params.id}`)
        .then(res => res.json())
        .then(data => {
            setResumeName(data.resume_name);
            setFullName(data.full_name);
            setSummary(data.summary);
            setContacts(JSON.parse(data.phone || "[]") as typeof contacts);
            setExperiences(JSON.parse(data.experience_json || "[]") as typeof experiences);
            setProjects(JSON.parse(data.projects_json || "[]") as typeof projects);
            setEducation(JSON.parse(data.education_json || "[]") as typeof education);
            setSkillGroups(JSON.parse(data.skills_json || "[]") as typeof skillGroups);
            setCertifications(JSON.parse(data.github_url || "[]") as typeof certifications);
          });
    }
  }, [params.id, isNew]);

  const handleSave = async () => {
    const payload = {
      resume_name: resumeName,
      full_name: fullName,
      summary,
      phone: JSON.stringify(contacts),
      experience_json: JSON.stringify(experiences),
      projects_json: JSON.stringify(projects),
      education_json: JSON.stringify(education),
      skills_json: JSON.stringify(skillGroups),
      github_url: JSON.stringify(certifications)
    };

    const url = isNew 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/${params.id}`;
    
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Resume saved successfully!");
        router.push("/admin/resume");
      }
    } catch (err) { console.error(err); }
  };

// Helper Functions yang Type-Safe
const removeItem = <T,>(list: T[], setList: (val: T[]) => void, index: number) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
  };

  const removeBullet = <T extends BulletItem>(
    list: T[], 
    setList: (val: T[]) => void, 
    entryIndex: number, 
    bulletIndex: number
  ) => {
    const newList = [...list];
    newList[entryIndex].bullets = newList[entryIndex].bullets.filter((_, i) => i !== bulletIndex);
    setList(newList);
  };

  return (
    <div className="p-8 bg-[#0d1117] min-h-screen text-white space-y-6 pb-24">
      {/* HEADER & ACTIONS */}
      <div className="flex justify-between items-center border-b border-[#30363d] pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/admin/resume")} className="hover:bg-gray-800">
            <ArrowLeft size={20}/>
          </Button>
          <h1 className="text-2xl font-mono italic">{"//"} {isNew ? 'CREATE_NEW_RESUME' : 'EDIT_RESUME'}</h1>
        </div>
        <div className="flex gap-3">
          {!isNew && (
            <Button 
              onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/generate/${params.id}?preview=true`, "_blank")} 
              variant="outline" 
              className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
            >
              <FileDown className="mr-2 h-4 w-4" /> Preview PDF
            </Button>
          )}
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 font-bold px-6">
            <Save className="mr-2 h-4 w-4" /> SAVE_CHANGES
          </Button>
        </div>
      </div>

      {/* VERSION NAME */}
      <div className="max-w-xl mx-auto bg-[#161b22] p-4 rounded-lg border border-[#30363d] mb-6">
        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Resume_Version_Name</label>
        <Input 
          value={resumeName} 
          onChange={e => setResumeName(e.target.value)} 
          placeholder="e.g., CV for Web Developer" 
          className="bg-[#0d1117] border-[#30363d] text-emerald-400 font-bold" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KOLOM KIRI */}
        <div className="space-y-6">
          {/* PERSONAL & CONTACTS */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono text-gray-400 uppercase">Personal_&_Contacts</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setContacts([...contacts, { label: "", value: "", url: "" }])} className="text-emerald-400 hover:bg-emerald-400/10">
                <Plus size={14}/>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name (e.g. SAIFUDIN NASIR)" className="bg-[#0d1117] border-[#30363d] text-lg font-bold" />
              <div className="space-y-2">
                {contacts.map((c, i) => (
                  <div key={i} className="flex gap-2 group">
                    <Input value={c.label} onChange={e => { const n = [...contacts]; n[i].label = e.target.value; setContacts(n); }} placeholder="Label (Email)" className="bg-[#0d1117] w-1/3" />
                    <Input value={c.url} onChange={e => { const n = [...contacts]; n[i].url = e.target.value; setContacts(n); }} placeholder="URL / Value" className="bg-[#0d1117] flex-1" />
                    <Button size="icon" variant="ghost" onClick={() => removeItem(contacts, setContacts, i)} className="text-red-500 hover:bg-red-500/10">
                      <Trash2 size={14}/>
                    </Button>
                  </div>
                ))}
              </div>
              <Textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Professional Summary..." className="bg-[#0d1117] border-[#30363d] h-28 text-sm" />
            </CardContent>
          </Card>

          {/* TECHNICAL PROJECTS */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono text-gray-400 uppercase">Technical_Projects</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setProjects([...projects, { title: "", category: "", bullets: [""] }])} className="text-emerald-400">
                <Plus size={14}/>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i} className="p-3 border border-[#30363d] rounded-lg bg-[#0d1117] relative group space-y-2">
                  <Button size="icon" variant="ghost" onClick={() => removeItem(projects, setProjects, i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100">
                    <Trash2 size={14}/>
                  </Button>
                  <Input value={proj.title} onChange={e => { const n = [...projects]; n[i].title = e.target.value; setProjects(n); }} placeholder="Project Title" className="font-bold text-emerald-400 bg-transparent border-none p-0 h-7 text-base" />
                  <Input value={proj.category} onChange={e => { const n = [...projects]; n[i].category = e.target.value; setProjects(n); }} placeholder="Project Category" className="text-xs bg-transparent border-none p-0 h-4 text-gray-500" />
                  <div className="space-y-1 pt-2">
                    {proj.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-2 group/bullet">
                        <Input value={b} onChange={e => { const n = [...projects]; n[i].bullets[bi] = e.target.value; setProjects(n); }} placeholder="Action point..." className="bg-transparent border-dashed border-[#30363d] text-[11px] h-6 flex-1" />
                        <Button size="icon" variant="ghost" onClick={() => removeBullet(projects, setProjects, i, bi)} className="h-6 w-6 text-red-400 opacity-0 group-hover/bullet:opacity-100">
                          <Trash2 size={10}/>
                        </Button>
                      </div>
                    ))}
                    <Button size="sm" variant="ghost" onClick={() => { const n = [...projects]; n[i].bullets.push(""); setProjects(n); }} className="text-[10px] text-gray-500 mt-1">+ Add Project Point</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-6">
          {/* WORK EXPERIENCE */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono text-gray-400 uppercase">Work_Experience</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setExperiences([...experiences, { company: "", role: "", period: "", bullets: [""] }])} className="text-emerald-400">
                <Plus size={14}/>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i} className="p-3 border border-[#30363d] rounded-lg bg-[#0d1117] relative group space-y-2">
                  <Button size="icon" variant="ghost" onClick={() => removeItem(experiences, setExperiences, i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100">
                    <Trash2 size={14}/>
                  </Button>
                  <div className="flex justify-between gap-2 pr-8">
                    <Input value={exp.company} onChange={e => { const n = [...experiences]; n[i].company = e.target.value; setExperiences(n); }} placeholder="Company" className="font-bold text-emerald-400 bg-transparent border-none p-0 h-7 text-base w-1/2" />
                    <Input value={exp.period} onChange={e => { const n = [...experiences]; n[i].period = e.target.value; setExperiences(n); }} placeholder="Year Range" className="text-right bg-transparent border-none text-xs w-1/2 text-gray-400" />
                  </div>
                  <Input value={exp.role} onChange={e => { const n = [...experiences]; n[i].role = e.target.value; setExperiences(n); }} placeholder="Role / Position" className="text-xs bg-transparent border-none p-0 h-5" />
                  <div className="space-y-1">
                    {exp.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-2 group/bullet">
                        <Input value={b} onChange={e => { const n = [...experiences]; n[i].bullets[bi] = e.target.value; setExperiences(n); }} placeholder="Responsibility..." className="bg-transparent border-dashed border-[#30363d] text-[11px] h-6 flex-1" />
                        <Button size="icon" variant="ghost" onClick={() => removeBullet(experiences, setExperiences, i, bi)} className="h-6 w-6 text-red-400 opacity-0 group-hover/bullet:opacity-100">
                          <Trash2 size={10}/>
                        </Button>
                      </div>
                    ))}
                    <Button size="sm" variant="ghost" onClick={() => { const n = [...experiences]; n[i].bullets.push(""); setExperiences(n); }} className="text-[10px] text-gray-500 mt-1">+ Add Task Point</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* EDUCATION */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono text-gray-400 uppercase">Education</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setEducation([...education, { institution: "", degree: "", period: "", bullets: [""] }])} className="text-emerald-400">
                <Plus size={14}/>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="p-3 border border-[#30363d] rounded-lg bg-[#0d1117] relative group space-y-1">
                  <Button size="icon" variant="ghost" onClick={() => removeItem(education, setEducation, i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100">
                    <Trash2 size={14}/>
                  </Button>
                  <div className="flex justify-between gap-2 pr-8">
                    <Input value={edu.institution} onChange={e => { const n = [...education]; n[i].institution = e.target.value; setEducation(n); }} placeholder="University" className="font-bold text-emerald-400 bg-transparent border-none p-0 h-7 text-base" />
                    <Input value={edu.period} onChange={e => { const n = [...education]; n[i].period = e.target.value; setEducation(n); }} placeholder="Year" className="text-right bg-transparent border-none text-xs text-gray-400" />
                  </div>
                  <Input value={edu.degree} onChange={e => { const n = [...education]; n[i].degree = e.target.value; setEducation(n); }} placeholder="Degree & GPA" className="text-xs bg-transparent border-none p-0 h-5" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SKILLS CATEGORIES */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono text-gray-400 uppercase">Skills_Categories</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setSkillGroups([...skillGroups, { category: "", summary: "" }])} className="text-emerald-400">
                <Plus size={14}/>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {skillGroups.map((s, i) => (
                <div key={i} className="space-y-2 border-b border-[#30363d] pb-3 last:border-0 relative group">
                  <Button size="icon" variant="ghost" onClick={() => removeItem(skillGroups, setSkillGroups, i)} className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100">
                    <Trash2 size={14}/>
                  </Button>
                  <Input value={s.category} onChange={e => { const n = [...skillGroups]; n[i].category = e.target.value; setSkillGroups(n); }} placeholder="Category (e.g. Technical)" className="bg-[#0d1117] font-bold text-xs pr-8" />
                  <Input value={s.summary} onChange={e => { const n = [...skillGroups]; n[i].summary = e.target.value; setSkillGroups(n); }} placeholder="Skills (comma separated)" className="bg-[#0d1117] text-[11px]" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* TRAININGS & CERTIFICATIONS */}
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-mono text-gray-400 uppercase">Trainings_&_Certifications</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setCertifications([...certifications, ""])} className="text-emerald-400">
                <Plus size={14}/>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {certifications.map((cert, i) => (
                <div key={i} className="flex gap-2 group">
                  <Input value={cert} onChange={e => { const n = [...certifications]; n[i] = e.target.value; setCertifications(n); }} placeholder="Certification Name" className="bg-[#0d1117] border-[#30363d] text-xs" />
                  <Button size="icon" variant="ghost" onClick={() => removeItem(certifications, setCertifications, i)} className="text-red-500 hover:bg-red-500/10">
                    <Trash2 size={14}/>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}