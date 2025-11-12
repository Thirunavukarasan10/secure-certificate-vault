import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Dropdown from '../components/Dropdown.jsx';
import { ROLES, ROLE_OPTIONS, ROUTE_DEFAULTS } from '../utils/constants.js';
import { useAuth } from '../context/AuthContext.jsx';
import { loginUser, registerUser } from '../lib/api.js';

export default function Auth() {
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'register' ? 'register' : 'login';
  const [role, setRole] = React.useState(ROLE_OPTIONS[0].value);
  const [form, setForm] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const toBackendRole = (r) => (r === ROLES.ADMIN ? 'HOD' : (r === ROLES.EMPLOYER ? 'EMPLOYER' : 'STUDENT'));

  const isStrongPassword = (pwd) => {
    if (!pwd || pwd.length < 8) return false;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNonAlnum = /[^A-Za-z0-9]/.test(pwd); // symbols or spaces
    return hasLetter && hasNonAlnum;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic client-side validation (UI only)
      if (mode === 'register') {
        if (!isStrongPassword(form.password)) {
          setErrors((er) => ({ ...er, password: 'Use 8+ chars with letters and symbols/spaces' }));
          return;
        }
      }
      if (mode === 'login' && !form.password) {
        setErrors((er) => ({ ...er, password: 'Password required' }));
        return;
      }

      if (mode === 'register') {
        const identifier = role === ROLES.STUDENT ? form.rollNo : form.email;
        const payload = { identifier, password: form.password, role: toBackendRole(role), name: form.name, email: form.email };
        const res = await registerUser(payload);
        if (res?.data?.role) {
          toast.success('Registered successfully. Please login.', { duration: 2000 });
          navigate('/auth?mode=login');
        } else {
          toast.error(res?.data?.message || 'Registration failed');
        }
        return;
      }

      // login
      const identifier = form.identifier;
      const payload = { identifier, password: form.password };
      const res = await loginUser(payload);
      const data = res?.data;
      if (data?.token && data?.role) {
        login({ token: data.token, role: data.role, userId: data.userId, identifier: data.identifier, name: data.name });
        const mappedRole = data.role === 'HOD' ? ROLES.ADMIN : (data.role === 'EMPLOYER' ? ROLES.EMPLOYER : ROLES.STUDENT);
        toast.success('Logged in successfully', { duration: 2000 });
        navigate(ROUTE_DEFAULTS[mappedRole]);
      } else {
        toast.error(data?.message || 'Invalid credentials');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Request failed';
      toast.error(msg);
    }
  };

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Geometric Shapes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Animated Grid Lines */}
          <g opacity="0.3">
            {[...Array(15)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 60}
                x2="1200"
                y2={i * 60}
                stroke="#3b82f6"
                strokeWidth="1"
                strokeDasharray="4,4"
              >
                <animate
                  attributeName="opacity"
                  values="0.1;0.3;0.1"
                  dur={`${3 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </line>
            ))}
            {[...Array(20)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 60}
                y1="0"
                x2={i * 60}
                y2="800"
                stroke="#8b5cf6"
                strokeWidth="1"
                strokeDasharray="4,4"
              >
                <animate
                  attributeName="opacity"
                  values="0.1;0.3;0.1"
                  dur={`${2 + i * 0.15}s`}
                  repeatCount="indefinite"
                />
              </line>
            ))}
          </g>

          {/* Animated Geometric Cubes */}
          {[
            { x: 100, y: 150, size: 80, delay: 0 },
            { x: 400, y: 100, size: 60, delay: 0.5 },
            { x: 700, y: 200, size: 100, delay: 1 },
            { x: 1000, y: 120, size: 70, delay: 1.5 },
            { x: 200, y: 400, size: 90, delay: 0.3 },
            { x: 600, y: 450, size: 75, delay: 0.8 },
            { x: 900, y: 500, size: 85, delay: 1.2 },
            { x: 300, y: 600, size: 65, delay: 0.6 },
            { x: 800, y: 650, size: 95, delay: 1.4 },
          ].map((cube, idx) => (
            <g key={`cube-${idx}`} transform={`translate(${cube.x}, ${cube.y})`}>
              {/* Cube faces */}
              <polygon
                points="0,0 40,20 40,60 0,40"
                fill="url(#glowGrad)"
                opacity="0.4"
                filter="url(#glow)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values={`0 20 30; 360 20 30`}
                  dur={`${15 + idx * 2}s`}
                  repeatCount="indefinite"
                />
              </polygon>
              <polygon
                points="40,20 80,0 80,40 40,60"
                fill="url(#glowGrad)"
                opacity="0.3"
                filter="url(#glow)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values={`0 60 30; 360 60 30`}
                  dur={`${18 + idx * 2}s`}
                  repeatCount="indefinite"
                />
              </polygon>
              <polygon
                points="0,40 40,60 80,40 40,20"
                fill="url(#glowGrad)"
                opacity="0.5"
                filter="url(#glow)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values={`0 40 50; 360 40 50`}
                  dur={`${20 + idx * 2}s`}
                  repeatCount="indefinite"
                />
              </polygon>
            </g>
          ))}

          {/* Glowing Squares */}
          {[
            { x: 150, y: 80, size: 20 },
            { x: 450, y: 250, size: 15 },
            { x: 750, y: 100, size: 25 },
            { x: 1050, y: 300, size: 18 },
            { x: 250, y: 500, size: 22 },
            { x: 550, y: 600, size: 16 },
            { x: 850, y: 400, size: 20 },
            { x: 350, y: 250, size: 14 },
            { x: 650, y: 350, size: 19 },
            { x: 950, y: 550, size: 17 },
          ].map((square, idx) => (
            <rect
              key={`square-${idx}`}
              x={square.x}
              y={square.y}
              width={square.size}
              height={square.size}
              fill="#3b82f6"
              opacity="0.6"
              filter="url(#glow)"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur={`${2 + idx * 0.3}s`}
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 ${square.x + square.size/2} ${square.y + square.size/2}; 180 ${square.x + square.size/2} ${square.y + square.size/2}; 360 ${square.x + square.size/2} ${square.y + square.size/2}`}
                dur={`${8 + idx * 0.5}s`}
                repeatCount="indefinite"
              />
            </rect>
          ))}

          {/* Animated Connection Lines */}
          <g opacity="0.4" stroke="#3b82f6" strokeWidth="1.5" fill="none">
            <path d="M 150 80 L 450 250 L 750 100" strokeDasharray="3,3">
              <animate
                attributeName="stroke-dashoffset"
                values="0;20;0"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M 750 100 L 1050 300 L 850 400" strokeDasharray="3,3">
              <animate
                attributeName="stroke-dashoffset"
                values="0;20;0"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M 250 500 L 550 600 L 850 400" strokeDasharray="3,3">
              <animate
                attributeName="stroke-dashoffset"
                values="0;20;0"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M 350 250 L 650 350 L 950 550" strokeDasharray="3,3">
              <animate
                attributeName="stroke-dashoffset"
                values="0;20;0"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Floating Particles */}
          {[...Array(30)].map((_, idx) => (
            <circle
              key={`particle-${idx}`}
              cx={Math.random() * 1200}
              cy={Math.random() * 800}
              r={2 + Math.random() * 3}
              fill="#8b5cf6"
              opacity="0.5"
            >
              <animate
                attributeName="cy"
                values={`${Math.random() * 800};${Math.random() * 800};${Math.random() * 800}`}
                dur={`${5 + Math.random() * 5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.8;0.2"
                dur={`${3 + Math.random() * 2}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          {/* Centered Auth Card */}
          <div className="w-full max-w-md card animate-slide-up p-6 md:p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
            <div className="mb-6 flex items-center gap-2 text-sm">
              <button
                onClick={() => setParams({ mode: 'login' })}
                className={`rounded-md px-4 py-2 font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-black text-white shadow-lg'
                    : 'hover:bg-black/5 text-gray-600'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setParams({ mode: 'register' })}
                className={`rounded-md px-4 py-2 font-medium transition-all ${
                  mode === 'register'
                    ? 'bg-black text-white shadow-lg'
                    : 'hover:bg-black/5 text-gray-600'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Dropdown label="Role" options={ROLE_OPTIONS} value={role} onChange={setRole} />

              {mode === 'login' ? (
                <>
                  <Input
                    label={role === ROLES.STUDENT ? 'Roll No' : 'Email'}
                    placeholder={role === ROLES.STUDENT ? 'Enter your roll no' : 'Enter your email'}
                    onChange={onChange('identifier')}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    onChange={(e) => {
                      setErrors((er) => ({ ...er, password: undefined }));
                      onChange('password')(e);
                    }}
                    hint={errors.password}
                    required
                  />
                </>
              ) : (
                <>
                  {role === ROLES.STUDENT && (
                    <>
                      <Input
                        label="Roll No"
                        placeholder="e.g. 22CS123"
                        onChange={onChange('rollNo')}
                        required
                      />
                      <Input
                        label="Name"
                        placeholder="Your full name"
                        onChange={onChange('name')}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        onChange={onChange('email')}
                        required
                      />
                      <Input
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        onChange={(e) => {
                          setErrors((er) => ({ ...er, password: undefined }));
                          onChange('password')(e);
                        }}
                        hint={errors.password || '8+ chars, include letters and symbols/spaces'}
                        required
                      />
                    </>
                  )}
                  {role === ROLES.ADMIN && (
                    <>
                      <Input
                        label="Department"
                        placeholder="e.g. Computer Science"
                        onChange={onChange('department')}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        onChange={onChange('email')}
                        required
                      />
                      <Input
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        onChange={(e) => {
                          setErrors((er) => ({ ...er, password: undefined }));
                          onChange('password')(e);
                        }}
                        hint={errors.password || '8+ chars, include letters and symbols/spaces'}
                        required
                      />
                    </>
                  )}
                  {role === ROLES.EMPLOYER && (
                    <>
                      <Input
                        label="Organization"
                        placeholder="Company name"
                        onChange={onChange('organization')}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        onChange={onChange('email')}
                        required
                      />
                      <Input
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        onChange={(e) => {
                          setErrors((er) => ({ ...er, password: undefined }));
                          onChange('password')(e);
                        }}
                        hint={errors.password || '8+ chars, include letters and symbols/spaces'}
                        required
                      />
                    </>
                  )}
                </>
              )}

              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full hover-lift">
                  {mode === 'login' ? 'Login' : 'Create account'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
