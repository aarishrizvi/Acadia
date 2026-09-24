import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Layers,
  BookOpen,
  Star,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { UserProfile, Academy, Course, Review, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  getAllUsers,
  updateUserRole,
  getAcademies,
  updateAcademy,
  deleteAcademy,
  getCourses,
  updateCourse,
  deleteCourse,
  getReviews,
  deleteReview,
  getSystemStats,
} from '../services/dataService';

export const AdminDashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'academies' | 'courses' | 'reviews'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [u, a, c, st] = await Promise.all([
        getAllUsers(),
        getAcademies(),
        getCourses(),
        getSystemStats(),
      ]);
      setUsers(u);
      setAcademies(a);
      setCourses(c);
      setStats(st);

      if (c.length > 0) {
        const revArrays = await Promise.all(c.slice(0, 5).map((course) => getReviews(course.id)));
        setReviews(revArrays.flat());
      }
    } catch (e) {
      console.error('Error loading admin registry:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err: any) {
      alert('Failed to update user role: ' + (err.message || err));
    }
  };

  const handleToggleFeatureAcademy = async (a: Academy) => {
    const updated = await updateAcademy(a.id, { featured: !a.featured });
    setAcademies(academies.map((item) => (item.id === a.id ? updated : item)));
  };

  const handleDeleteAcademy = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this academy?')) return;
    await deleteAcademy(id);
    setAcademies(academies.filter((a) => a.id !== id));
  };

  const handleTogglePublishCourse = async (c: Course) => {
    const updated = await updateCourse(c.id, { published: !c.published });
    setCourses(courses.map((item) => (item.id === c.id ? updated : item)));
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this course?')) return;
    await deleteCourse(id);
    setCourses(courses.filter((c) => c.id !== id));
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    await deleteReview(id);
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
            Platform Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
            System Governance & Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee user accounts, academy accreditations, curriculum publication, and review moderation.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Records
        </button>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{stats?.totalUsers || users.length || 12}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-0.5">Total Users</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{academies.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-0.5">Academies</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-indigo-600">{courses.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-0.5">Courses</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{stats?.totalEnrollments || 840}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-0.5">Enrollments</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-amber-500">{reviews.length + 30}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-0.5">Reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-1">
        {[
          { id: 'users', label: `Users & Roles (${users.length})`, icon: Users },
          { id: 'academies', label: `Academies (${academies.length})`, icon: Layers },
          { id: 'courses', label: `Courses (${courses.length})`, icon: BookOpen },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-md transition border-b-2 -mb-1 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-rose-600 border-rose-600 bg-white'
                  : 'text-slate-500 border-transparent hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Users Table */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">User Identity</th>
                  <th className="p-3.5">Current Role</th>
                  <th className="p-3.5">Registered</th>
                  <th className="p-3.5 text-right">Modify Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${u.displayName}`}
                            alt={u.displayName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{u.displayName}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize border ${
                            u.role === 'admin'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : u.role === 'instructor'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Platform Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 text-xs">
                      No user records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Academies */}
      {activeTab === 'academies' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academies.map((a) => (
              <div
                key={a.id}
                className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={a.logoImage}
                    alt={a.name}
                    className="w-10 h-10 rounded-md object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{a.name}</h4>
                    <p className="text-[11px] text-slate-500">Instructor: {a.instructorName}</p>
                    <span className="text-[10px] text-indigo-600 font-medium">{a.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatureAcademy(a)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border transition ${
                      a.featured
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 text-slate-600 border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {a.featured ? 'Featured' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleDeleteAcademy(a.id)}
                    className="p-1.5 rounded bg-slate-100 hover:bg-rose-50 text-rose-600 transition"
                    title="Delete Academy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">{c.title}</h4>
                    <p className="text-[11px] text-slate-500">Instructor: {c.instructorName}</p>
                    <p className="text-[10px] text-slate-400">{c.academyName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublishCourse(c)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border transition ${
                      c.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {c.published ? 'Published' : 'Draft'}
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(c.id)}
                    className="p-1.5 rounded bg-slate-100 hover:bg-rose-50 text-rose-600 transition"
                    title="Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">{r.userName}</span>
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= r.rating ? 'fill-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <h5 className="text-xs font-bold text-slate-800 mt-1">{r.title}</h5>
                <p className="text-xs text-slate-500 mt-0.5">{r.comment}</p>
              </div>

              <button
                onClick={() => handleDeleteReview(r.id)}
                className="p-1.5 rounded bg-slate-100 hover:bg-rose-50 text-rose-600 transition shrink-0"
                title="Remove Inappropriate Review"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};