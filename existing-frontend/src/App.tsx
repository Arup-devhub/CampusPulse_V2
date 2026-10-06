import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, Award, BarChart3, Bell, BookOpen,
  BriefcaseBusiness, CalendarDays, CheckCircle2, ChevronDown, CircleHelp,
  ClipboardCheck, Clock3, Code2, FileText, GraduationCap, LayoutDashboard,
  Menu, MessageSquareText, MoreHorizontal, Plus, Search, Settings, ShieldCheck,
  Sparkles, Target, TrendingUp, Users, X, Zap
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

type Page = "Dashboard" | "Readiness" | "Skill Gaps" | "Workshops" | "Drives" | "Assessments" | "Resume" | "Reports";
type Role = "Student" | "Placement Admin" | "Recruiter";

const readinessTrend = [
  { name: "Jun", value: 52 }, { name: "Jul", value: 58 }, { name: "Aug", value: 61 },
  { name: "Sep", value: 66 }, { name: "Oct", value: 74 }
];
const skillData = [
  { skill: "DSA", students: 50 }, { skill: "C++", students: 37 }, { skill: "SQL", students: 18 },
  { skill: "Communication", students: 12 }, { skill: "DBMS", students: 9 }
];

const navByRole: Record<Role, { label: Page; icon: any }[]> = {
  Student: [
    {label:"Dashboard",icon:LayoutDashboard},{label:"Readiness",icon:Target},{label:"Skill Gaps",icon:AlertTriangle},
    {label:"Workshops",icon:BookOpen},{label:"Drives",icon:BriefcaseBusiness},{label:"Assessments",icon:ClipboardCheck},
    {label:"Resume",icon:FileText},{label:"Reports",icon:BarChart3}
  ],
  "Placement Admin": [
    {label:"Dashboard",icon:LayoutDashboard},{label:"Readiness",icon:Target},{label:"Skill Gaps",icon:AlertTriangle},
    {label:"Workshops",icon:BookOpen},{label:"Drives",icon:BriefcaseBusiness},{label:"Assessments",icon:ClipboardCheck},
    {label:"Reports",icon:BarChart3}
  ],
  Recruiter: [
    {label:"Dashboard",icon:LayoutDashboard},{label:"Drives",icon:BriefcaseBusiness},{label:"Assessments",icon:ClipboardCheck},
    {label:"Readiness",icon:Target},{label:"Reports",icon:BarChart3}
  ]
};

function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [role, setRole] = useState<Role>("Placement Admin");
  const [sidebar, setSidebar] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const nav = navByRole[role];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebar ? "open" : "closed"}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={19}/></div>
          {sidebar && <div><strong>Campus<span>Pulse</span></strong><small>Placement Intelligence</small></div>}
        </div>

        {sidebar && <div className="role-pill"><span className="dot"/>{role}<ChevronDown size={14}/></div>}

        <nav>
          {nav.map(item => {
            const Icon = item.icon;
            return <button key={item.label} className={`nav-item ${page === item.label ? "active":""}`} onClick={()=>setPage(item.label)}>
              <Icon size={18}/>{sidebar && <span>{item.label}</span>}
            </button>
          })}
        </nav>

        <div className="sidebar-bottom">
          {sidebar && <div className="help-card"><CircleHelp size={17}/><div><b>Need help?</b><span>View platform guide</span></div></div>}
          <button className="nav-item"><Settings size={18}/>{sidebar && <span>Settings</span>}</button>
          <div className="profile-mini">
            <div className="avatar">PD</div>
            {sidebar && <div><b>Priyanshu Dash</b><span>Placement Officer</span></div>}
          </div>
        </div>
      </aside>

      <main className={`main ${sidebar ? "with-sidebar":"full"}`}>
        <header className="topbar">
          <button className="icon-btn" onClick={()=>setSidebar(v=>!v)}><Menu size={20}/></button>
          <div className="crumbs"><span>CampusPulse</span><b>/</b><strong>{page}</strong></div>
          <div className="top-actions">
            <div className="role-switch">
              {(["Student","Placement Admin","Recruiter"] as Role[]).map(r =>
                <button key={r} className={role===r?"selected":""} onClick={()=>{setRole(r);setPage("Dashboard")}}>{r}</button>
              )}
            </div>
            <button className="icon-btn notification"><Bell size={19}/><i/></button>
            <div className="avatar">PD</div>
          </div>
        </header>

        <div className="content">
          {page === "Dashboard" && <Dashboard role={role} onWorkshop={()=>setShowCreate(true)} />}
          {page === "Readiness" && <Readiness />}
          {page === "Skill Gaps" && <SkillGaps onWorkshop={()=>setShowCreate(true)} />}
          {page === "Workshops" && <Workshops onCreate={()=>setShowCreate(true)} />}
          {page === "Drives" && <Drives />}
          {page === "Assessments" && <Assessments />}
          {page === "Resume" && <Resume />}
          {page === "Reports" && <Reports />}
        </div>
      </main>

      {showCreate && <CreateWorkshop onClose={()=>setShowCreate(false)}/>}
    </div>
  );
}

function PageHead({eyebrow,title,description,action}:{eyebrow?:string,title:string,description?:string,action?:React.ReactNode}) {
  return <div className="page-head">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description&&<p>{description}</p>}</div>
    {action}
  </div>
}

function Stat({icon:Icon,label,value,delta,tone="blue"}:{icon:any,label:string,value:string,delta?:string,tone?:string}) {
  return <div className="stat-card">
    <div className={`stat-icon ${tone}`}><Icon size={19}/></div>
    <div className="stat-main"><span>{label}</span><strong>{value}</strong>{delta&&<small className="positive">{delta}</small>}</div>
  </div>
}

function Dashboard({role,onWorkshop}:{role:Role,onWorkshop:()=>void}) {
  const student = role==="Student";
  return <>
    <PageHead eyebrow={student?"STUDENT OVERVIEW":"PLACEMENT COMMAND CENTER"}
      title={student?"Good evening, Priyanshu 👋":"Placement readiness at a glance"}
      description={student?"Track your company readiness, close skill gaps and complete your next recommended action.":"Monitor readiness, identify at-risk students and turn skill-gap data into targeted interventions."}
      action={!student&&<button className="primary" onClick={onWorkshop}><Plus size={17}/> Create workshop</button>}
    />

    <section className="stat-grid">
      <Stat icon={Users} label={student?"Applications":"Total students"} value={student?"8":"1,248"} delta={student?"+2 this week":"+8.4% vs last month"} tone="blue"/>
      <Stat icon={Target} label={student?"Overall readiness":"Placement-ready"} value={student?"74%":"68%"} delta={student?"+12% this month":"+104 students"} tone="green"/>
      <Stat icon={BriefcaseBusiness} label={student?"Eligible drives":"Active drives"} value={student?"6":"14"} delta={student?"3 closing soon":"3 starting this week"} tone="violet"/>
      <Stat icon={AlertTriangle} label={student?"Priority gaps":"At-risk students"} value={student?"3":"186"} delta={student?"2 high priority":"14 need action today"} tone="amber"/>
    </section>

    <div className="dashboard-grid">
      <Card className="chart-card">
        <div className="card-head"><div><h3>{student?"Readiness progress":"Readiness trend"}</h3><p>{student?"Your average company readiness over time":"Average readiness across active placement cohorts"}</p></div><button className="ghost">Last 5 months <ChevronDown size={15}/></button></div>
        <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={readinessTrend}>
          <defs><linearGradient id="fillPulse" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity=".24"/><stop offset="100%" stopColor="#2563eb" stopOpacity="0"/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef5"/>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:"#7b8798",fontSize:12}}/>
          <YAxis domain={[40,80]} axisLine={false} tickLine={false} tick={{fill:"#7b8798",fontSize:12}}/>
          <Tooltip/>
          <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fill="url(#fillPulse)"/>
        </AreaChart></ResponsiveContainer></div>
      </Card>

      <Card className="readiness-card">
        <div className="card-head"><div><h3>{student?"TCS readiness":"Intervention impact"}</h3><p>{student?"Next target company":"This month's completed workshops"}</p></div><MoreHorizontal size={18}/></div>
        {student ? <><div className="score-ring"><div><strong>74</strong><span>/ 100</span></div></div><div className="score-status"><span className="badge green">Good</span><span>+8 points since last assessment</span></div><div className="mini-metrics"><MiniMetric label="Aptitude" value="82"/><MiniMetric label="Technical" value="61"/><MiniMetric label="Coding" value="55"/><MiniMetric label="Interview" value="74"/></div></>
        : <><div className="impact-number">+18.6<span>%</span></div><p className="muted">Average readiness improvement after intervention</p><div className="progress-row"><span>Students crossing threshold</span><b>72%</b></div><div className="progress"><i style={{width:"72%"}}/></div><div className="progress-row"><span>Attendance rate</span><b>89%</b></div><div className="progress"><i style={{width:"89%"}}/></div></>}
      </Card>
    </div>

    <div className="dashboard-grid lower">
      <Card>
        <div className="card-head"><div><h3>{student?"Recommended for you":"Top skill gaps"}</h3><p>{student?"Actions ranked by your target company":"Students affected across active drives"}</p></div><button className="link" onClick={()=>{}}>View all <ArrowRight size={15}/></button></div>
        {student ? <RecommendationList/> : <SkillBars/>}
      </Card>
      <Card>
        <div className="card-head"><div><h3>{student?"Upcoming drives":"Upcoming drives"}</h3><p>{student?"Your eligible placement opportunities":"Recruitment activity requiring attention"}</p></div><button className="link">Calendar <ArrowRight size={15}/></button></div>
        <DriveList student={student}/>
      </Card>
    </div>
  </>;
}

function MiniMetric({label,value}:{label:string,value:string}) {
  return <div className="mini-metric"><span>{label}</span><b>{value}%</b></div>
}

function RecommendationList() {
  const items = [
    ["DSA Practice Set","Coding","30 min","High"],
    ["SQL Mock Assessment","Technical","45 min","High"],
    ["AI Technical Interview","Interview","20 min","Medium"]
  ];
  return <div className="list">{items.map(([title,type,time,priority])=><div className="list-row" key={title}>
    <div className="list-icon"><Zap size={16}/></div><div className="list-copy"><b>{title}</b><span>{type} · {time}</span></div><span className={`badge ${priority==="High"?"red":"amber"}`}>{priority}</span><ArrowRight size={16} className="row-arrow"/>
  </div>)}</div>
}

function SkillBars() {
  return <div className="skill-bars">{skillData.slice(0,4).map((x,i)=><div className="skill-bar-row" key={x.skill}><div><b>{x.skill}</b><span>{x.students} students</span></div><div className="bar"><i style={{width:`${Math.min(100,x.students*1.7)}%`}}/></div><strong>{x.students}</strong></div>)}</div>
}

function DriveList({student=false}) {
  const drives = [
    ["TCS","Software Engineer","18 Oct","74% ready"],
    ["Infosys","Systems Engineer","24 Oct","Eligible"],
    ["Deloitte","Analyst","02 Nov","72% ready"]
  ];
  return <div className="list">{drives.map(([company,role,date,status])=><div className="drive-row" key={company}>
    <div className="company-logo">{company[0]}</div><div className="list-copy"><b>{company}</b><span>{role} · {date}</span></div><span className={`badge ${status.includes("%")?"blue":"green"}`}>{status}</span>
  </div>)}</div>
}

function Card({children,className=""}:{children:React.ReactNode,className?:string}) { return <section className={`card ${className}`}>{children}</section> }

function Readiness() {
  const [company,setCompany]=useState("TCS");
  return <>
    <PageHead eyebrow="READINESS INTELLIGENCE" title="Company-specific readiness" description="See exactly where a student or cohort may struggle before the recruitment process begins." action={<select className="select" value={company} onChange={e=>setCompany(e.target.value)}><option>TCS</option><option>Infosys</option><option>Deloitte</option></select>}/>
    <div className="readiness-overview">
      <Card className="big-score"><div className="eyebrow">OVERALL READINESS</div><div className="big-number">74<span>/100</span></div><span className="badge green">Low risk</span><p>Readiness improved by 8 points after the latest assessment.</p></Card>
      <Card><div className="card-head"><h3>Stage readiness</h3><span className="muted">Target: {company}</span></div><Stage label="Aptitude" value={82}/><Stage label="Technical" value={61}/><Stage label="Coding" value={55}/><Stage label="Interview" value={74}/></Card>
      <Card><div className="card-head"><h3>Eligibility</h3><CheckCircle2 className="green-text"/></div><div className="eligibility"><div><span>CGPA</span><b>8.2 / 7.0</b></div><div><span>Backlogs</span><b>0 / 0</b></div><div><span>Branch</span><b>CSE ✓</b></div><div><span>Resume match</span><b>86%</b></div></div></Card>
    </div>
    <div className="two-col">
      <Card><div className="card-head"><div><h3>Readiness history</h3><p>Company readiness after each intervention</p></div></div><div className="chart tall"><ResponsiveContainer width="100%" height="100%"><AreaChart data={[{name:"Baseline",value:54},{name:"Assessment",value:61},{name:"Workshop",value:68},{name:"Reassessment",value:74}]}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef5"/><XAxis dataKey="name" axisLine={false} tickLine={false}/><YAxis domain={[40,80]} axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity=".12" fill="#2563eb" strokeWidth={3}/></AreaChart></ResponsiveContainer></div></Card>
      <Card><div className="card-head"><div><h3>Priority gaps</h3><p>Skills currently blocking readiness</p></div></div><GapList/></Card>
    </div>
  </>
}

function Stage({label,value}:{label:string,value:number}) { return <div className="stage"><div><span>{label}</span><b>{value}%</b></div><div className="progress"><i style={{width:`${value}%`}}/></div></div> }
function GapList() {
  return <div className="gap-list"><Gap name="Data Structures & Algorithms" score="55" required="75" priority="Critical"/><Gap name="C++" score="58" required="70" priority="High"/><Gap name="SQL" score="62" required="70" priority="Medium"/></div>
}
function Gap({name,score,required,priority}:{name:string,score:string,required:string,priority:string}) { return <div className="gap"><div className="gap-title"><b>{name}</b><span className={`badge ${priority==="Critical"?"red":priority==="High"?"amber":"blue"}`}>{priority}</span></div><div className="gap-numbers"><span>Current <b>{score}</b></span><span>Required <b>{required}</b></span><span>Gap <b>−{Number(required)-Number(score)}</b></span></div></div> }

function SkillGaps({onWorkshop}:{onWorkshop:()=>void}) {
  return <>
    <PageHead eyebrow="COHORT INTELLIGENCE" title="Skill gap analytics" description="Find the skills affecting the largest number of students and convert them into interventions." action={<button className="primary" onClick={onWorkshop}><Plus size={17}/> Create intervention</button>}/>
    <div className="stat-grid">
      <Stat icon={AlertTriangle} label="Students with priority gaps" value="186" delta="14 need action today" tone="amber"/>
      <Stat icon={Code2} label="Top gap" value="DSA" delta="50 students" tone="violet"/>
      <Stat icon={TrendingUp} label="Avg. gap score" value="23 pts" delta="−4 pts this month" tone="blue"/>
      <Stat icon={CheckCircle2} label="Threshold crossed" value="72%" delta="+11% after workshops" tone="green"/>
    </div>
    <div className="two-col">
      <Card><div className="card-head"><div><h3>Students affected by skill</h3><p>Active placement cohorts</p></div><button className="ghost">All branches <ChevronDown size={15}/></button></div><div className="chart tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={skillData} layout="vertical" margin={{left:20,right:20}}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e9eef5"/><XAxis type="number" axisLine={false} tickLine={false}/><YAxis type="category" dataKey="skill" axisLine={false} tickLine={false} width={90}/><Tooltip/><Bar dataKey="students" radius={[0,6,6,0]} fill="#2563eb"/></BarChart></ResponsiveContainer></div></Card>
      <Card><div className="card-head"><div><h3>Intervention queue</h3><p>Recommended actions</p></div></div><div className="intervention-list"><Intervention skill="DSA + C++" count="50" status="Create workshop"/><Intervention skill="SQL + DBMS" count="18" status="Workshop available"/><Intervention skill="Communication" count="12" status="Create workshop"/></div></Card>
    </div>
    <Card><div className="card-head"><div><h3>Skill gap matrix</h3><p>Use this view to identify target cohorts before publishing an intervention.</p></div><button className="ghost">Export CSV</button></div><table><thead><tr><th>Skill</th><th>Affected</th><th>Avg. score</th><th>Required</th><th>Priority</th><th>Upcoming drive</th><th></th></tr></thead><tbody>{skillData.map((x,i)=><tr key={x.skill}><td><b>{x.skill}</b></td><td>{x.students}</td><td>{55+i*3}/100</td><td>70/100</td><td><span className={`badge ${i===0?"red":i<2?"amber":"blue"}`}>{i===0?"Critical":i<2?"High":"Medium"}</span></td><td>{i<2?"TCS":"Infosys"}</td><td><button className="link" onClick={onWorkshop}>Intervene <ArrowRight size={14}/></button></td></tr>)}</tbody></table></Card>
  </>
}
function Intervention({skill,count,status}:{skill:string,count:string,status:string}) { return <div className="intervention"><div className="list-icon"><BookOpen size={16}/></div><div><b>{skill}</b><span>{count} students affected</span></div><button className="small-btn">{status}</button></div> }

function Workshops({onCreate}:{onCreate:()=>void}) {
  return <>
    <PageHead eyebrow="COLLEGE INTERVENTIONS" title="Workshop management" description="Turn measured skill gaps into targeted, measurable placement interventions." action={<button className="primary" onClick={onCreate}><Plus size={17}/> Create workshop</button>}/>
    <div className="workshop-feature"><div><span className="eyebrow">RECOMMENDED INTERVENTION</span><h2>DSA + C++ Placement Bootcamp</h2><p>50 students are below the required DSA threshold for upcoming TCS recruitment.</p><div className="chips"><span>DSA</span><span>C++</span><span>TCS</span><span>50 target students</span></div><button className="primary">Review cohort <ArrowRight size={16}/></button></div><div className="feature-score"><strong>54 → 75</strong><span>target score</span><div className="progress"><i style={{width:"72%"}}/></div><small>Projected cohort size: 50</small></div></div>
    <div className="stat-grid"><Stat icon={Users} label="Target students" value="186" delta="Across 6 active workshops" tone="blue"/><Stat icon={CalendarDays} label="Upcoming sessions" value="8" delta="Next 14 days" tone="violet"/><Stat icon={CheckCircle2} label="Avg. attendance" value="89%" delta="+6% this month" tone="green"/><Stat icon={TrendingUp} label="Avg. improvement" value="+18.6%" delta="After intervention" tone="amber"/></div>
    <Card><div className="card-head"><div><h3>Active workshops</h3><p>Track registration, attendance and intervention impact.</p></div><button className="ghost">All statuses <ChevronDown size={15}/></button></div><table><thead><tr><th>Workshop</th><th>Target</th><th>Schedule</th><th>Registration</th><th>Impact</th><th>Status</th></tr></thead><tbody>{[
      ["DSA + C++ Placement Bootcamp","50 students","18 Oct · 2 hrs","42 / 50","+24 pts","Registration open"],
      ["SQL + DBMS Sprint","18 students","21 Oct · 90 min","18 / 18","+17 pts","Full"],
      ["Technical Interview Lab","32 students","25 Oct · 2 hrs","21 / 32","—","Registration open"]
    ].map(r=><tr key={r[0]}><td><b>{r[0]}</b><small className="table-sub">Placement intervention</small></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><span className="positive">{r[4]}</span></td><td><span className="badge green">{r[5]}</span></td></tr>)}</tbody></table></Card>
  </>
}

function Drives() {
  return <>
    <PageHead eyebrow="PLACEMENT DRIVES" title="Upcoming recruitment" description="Monitor company requirements, eligibility, candidate readiness and recruitment stages." action={<button className="primary"><Plus size={17}/> Create drive</button>}/>
    <div className="drive-grid">{[
      ["TCS","Software Engineer","18 Oct","₹7.2 LPA","1,240 candidates","74% avg readiness"],
      ["Infosys","Systems Engineer","24 Oct","₹6.5 LPA","860 candidates","71% avg readiness"],
      ["Deloitte","Analyst","02 Nov","₹8.0 LPA","410 candidates","68% avg readiness"]
    ].map((d,i)=><Card key={d[0]}><div className="company-head"><div className="company-logo large">{d[0][0]}</div><div><h3>{d[0]}</h3><span>{d[1]}</span></div><MoreHorizontal size={18}/></div><div className="drive-meta"><div><span>Drive date</span><b>{d[2]}</b></div><div><span>Package</span><b>{d[3]}</b></div></div><div className="drive-footer"><span>{d[4]}</span><span className="badge blue">{d[5]}</span></div><button className="outline full-btn">View drive <ArrowRight size={15}/></button></Card>)}</div>
  </>
}

function Assessments() {
  return <>
    <PageHead eyebrow="ASSESSMENT CENTER" title="Assessments" description="Create, schedule and review aptitude, technical and company-specific assessments." action={<button className="primary"><Plus size={17}/> Create assessment</button>}/>
    <div className="stat-grid"><Stat icon={ClipboardCheck} label="Active assessments" value="12" delta="4 scheduled today" tone="blue"/><Stat icon={Users} label="Attempts today" value="482" delta="91% completion" tone="green"/><Stat icon={TrendingUp} label="Avg. score" value="71%" delta="+5% vs last month" tone="violet"/><Stat icon={ShieldCheck} label="Proctoring events" value="26" delta="Review required: 4" tone="amber"/></div>
    <Card><div className="card-head"><div><h3>Recent assessments</h3><p>Monitor candidate performance and suspicious-event signals.</p></div><button className="ghost">Filter <ChevronDown size={15}/></button></div><table><thead><tr><th>Assessment</th><th>Type</th><th>Attempts</th><th>Avg. score</th><th>Completion</th><th>Status</th></tr></thead><tbody>{[
      ["TCS Technical Round","Technical","312","68%","94%","Live"],["Campus Aptitude Test","Aptitude","482","74%","91%","Live"],["SQL + DBMS Sprint","Company-specific","118","72%","100%","Completed"],["Coding Challenge #04","Coding","96","65%","86%","Review"]
    ].map(r=><tr key={r[0]}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td><span className={`badge ${r[5]==="Live"?"green":r[5]==="Review"?"amber":"blue"}`}>{r[5]}</span></td></tr>)}</tbody></table></Card>
  </>
}

function Resume() {
  return <>
    <PageHead eyebrow="RESUME INTELLIGENCE" title="JD-based resume builder" description="Match verified student data against a job description without fabricating qualifications."/>
    <div className="resume-layout">
      <Card><div className="card-head"><div><h3>Target job description</h3><p>Paste or upload a JD to extract requirements.</p></div><Sparkles size={19}/></div><textarea className="textarea" placeholder="Paste the company job description here...">Software Engineer — Strong DSA, C++, SQL and problem-solving skills. Experience with Git and REST APIs preferred.</textarea><button className="primary full-btn"><Sparkles size={16}/> Analyze JD</button><div className="extract"><b>Extracted requirements</b><div className="chips"><span>DSA</span><span>C++</span><span>SQL</span><span>Git</span><span>REST APIs</span></div></div></Card>
      <Card><div className="card-head"><div><h3>Match score</h3><p>Verified profile data only</p></div></div><div className="match-score">86%</div><div className="progress"><i style={{width:"86%"}}/></div><div className="match-list"><div><CheckCircle2/> DSA <span>Strong</span></div><div><CheckCircle2/> C++ <span>Strong</span></div><div><CheckCircle2/> SQL <span>Needs evidence</span></div><div><AlertTriangle/> REST APIs <span>Missing</span></div></div><button className="outline full-btn">Generate resume draft <ArrowRight size={15}/></button></Card>
    </div>
  </>
}

function Reports() {
  const data=[{name:"CSE",placed:72},{name:"IT",placed:64},{name:"ECE",placed:51},{name:"EEE",placed:43}];
  return <>
    <PageHead eyebrow="ANALYTICS" title="Placement reports" description="Track readiness, intervention outcomes, conversion and placement trends." action={<button className="outline">Export report</button>}/>
    <div className="two-col"><Card><div className="card-head"><div><h3>Branch-wise conversion</h3><p>Students reaching placement outcomes</p></div></div><div className="chart tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef5"/><XAxis dataKey="name" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="placed" radius={[7,7,0,0]} fill="#2563eb"/></BarChart></ResponsiveContainer></div></Card>
      <Card><div className="card-head"><div><h3>Outcome mix</h3><p>Current placement status</p></div></div><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{n:"Placed",v:52},{n:"Interview",v:18},{n:"Ready",v:20},{n:"At risk",v:10}]} dataKey="v" nameKey="n" innerRadius={58} outerRadius={86}><Cell fill="#2563eb"/><Cell fill="#7c3aed"/><Cell fill="#10b981"/><Cell fill="#f59e0b"/></Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-center"><b>1,248</b><span>students</span></div></div><div className="legend"><span><i className="l-blue"/>Placed 52%</span><span><i className="l-violet"/>Interview 18%</span><span><i className="l-green"/>Ready 20%</span><span><i className="l-amber"/>At risk 10%</span></div></Card></div>
    <Card><div className="card-head"><div><h3>Report library</h3><p>Generated operational and readiness reports</p></div></div><div className="report-list">{["College placement report","Company readiness report","Workshop impact report","Skill-gap report","Assessment performance report"].map((x,i)=><div className="report-row" key={x}><div className="list-icon"><FileText size={16}/></div><div><b>{x}</b><span>Updated {i+1} day{i?"s":""} ago · PDF</span></div><button className="ghost">Download</button></div>)}</div></Card>
  </>
}

function CreateWorkshop({onClose}:{onClose:()=>void}) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">NEW INTERVENTION</span><h2>Create workshop</h2><p>Build a targeted workshop from a measured skill gap.</p></div><button className="icon-btn" onClick={onClose}><X size={19}/></button></div>
    <div className="form-grid"><label>Workshop title<input defaultValue="DSA + C++ Placement Bootcamp"/></label><label>Target skill<select defaultValue="DSA"><option>DSA</option><option>C++</option><option>SQL</option><option>Communication</option></select></label><label>Linked drive<select><option>TCS — Software Engineer</option><option>Infosys — Systems Engineer</option></select></label><label>Delivery mode<select><option>College Classroom</option><option>Online</option><option>Hybrid</option></select></label><label>Date<input type="date" defaultValue="2026-10-18"/></label><label>Duration<select><option>2 hours</option><option>90 minutes</option><option>3 hours</option></select></label><label className="span-2">Targeting rule<textarea defaultValue={"Skill: Data Structures\nScore: < 60\nPriority: High/Critical\nBranches: CSE, IT, ECE"}/></label></div>
    <div className="cohort-preview"><div><b>Projected cohort</b><span>50 students match these rules</span></div><div className="cohort-avatars"><i>AR</i><i>PK</i><i>SD</i><i>+47</i></div></div>
    <div className="modal-actions"><button className="outline" onClick={onClose}>Save draft</button><button className="primary" onClick={onClose}>Create & review cohort <ArrowRight size={16}/></button></div>
  </div></div>
}
