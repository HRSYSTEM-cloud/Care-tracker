/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar as CalendarIcon, 
  FileText, 
  Bell, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  LayoutDashboard,
  Building2,
  DollarSign,
  X,
  Phone,
  User,
  UserCheck,
  Search,
  Download,
  Filter,
  Globe,
  LogOut,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  MoreVertical,
  ChevronLeft,
  Calendar as CalendarIconLucide,
  Menu,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Language = 'ar' | 'en';
type Tab = 'dashboard' | 'companies' | 'patients' | 'therapists' | 'sessions' | 'invoices' | 'reports' | 'calendar' | 'settings' | 'notifications' | 'services';

interface Translation {
  [key: string]: {
    ar: string;
    en: string;
  };
}

const translations: Translation = {
  appName: { ar: 'كير تراكر', en: 'CARE TRACKER' },
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  companies: { ar: 'الشركات', en: 'Companies' },
  patients: { ar: 'المرضى', en: 'Patients' },
  therapists: { ar: 'المعالجين', en: 'Therapists' },
  sessions: { ar: 'الجلسات', en: 'Sessions' },
  invoices: { ar: 'الفواتير', en: 'Invoices' },
  reports: { ar: 'التقارير', en: 'Reports' },
  calendar: { ar: 'التقويم', en: 'Calendar' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  totalCompanies: { ar: 'إجمالي الشركات', en: 'Total Companies' },
  totalPatients: { ar: 'إجمالي المرضى', en: 'Total Patients' },
  totalTherapists: { ar: 'إجمالي المعالجين', en: 'Total Therapists' },
  completedSessions: { ar: 'جلسات مكتملة', en: 'Completed Sessions' },
  remainingSessions: { ar: 'جلسات متبقية', en: 'Remaining Sessions' },
  monthlyRevenue: { ar: 'دخل الشهر', en: 'Monthly Revenue' },
  outstandingBalance: { ar: 'مبالغ معلقة', en: 'Outstanding Balance' },
  searchPlaceholder: { ar: 'بحث سريع...', en: 'Quick search...' },
  addCompany: { ar: 'إضافة شركة', en: 'Add Company' },
  addPatient: { ar: 'إضافة مريض', en: 'Add Patient' },
  addTherapist: { ar: 'إضافة معالج', en: 'Add Therapist' },
  addSession: { ar: 'تسجيل جلسة', en: 'Record Session' },
  generateInvoice: { ar: 'إصدار فاتورة', en: 'Generate Invoice' },
  export: { ar: 'تصدير', en: 'Export' },
  filter: { ar: 'تصفية', en: 'Filter' },
  language: { ar: 'English', en: 'العربية' },
  statusActive: { ar: 'نشط', en: 'Active' },
  statusCompleted: { ar: 'مكتمل', en: 'Completed' },
  statusPaused: { ar: 'متوقف', en: 'Paused' },
  billingMonthly: { ar: 'شهري', en: 'Monthly' },
  billingWeekly: { ar: 'أسبوعي', en: 'Weekly' },
  billingAfter: { ar: 'بعد الجلسات', en: 'After Sessions' },
  unpaid: { ar: 'غير مدفوع', en: 'Unpaid' },
  partiallyPaid: { ar: 'مدفوع جزئياً', en: 'Partially Paid' },
  paid: { ar: 'مدفوع', en: 'Paid' },
  totalSessions: { ar: 'إجمالي الجلسات', en: 'Total Sessions' },
  clinicName: { ar: 'اسم العيادة', en: 'Clinic Name' },
  currency: { ar: 'العملة', en: 'Currency' },
  address: { ar: 'العنوان', en: 'Address' },
  phone: { ar: 'رقم الهاتف', en: 'Phone Number' },
  saveSettings: { ar: 'حفظ الإعدادات', en: 'Save Settings' },
  settingsUpdated: { ar: 'تم تحديث الإعدادات بنجاح', en: 'Settings updated successfully' },
  clinicManagement: { ar: 'نظام إدارة العيادة', en: 'CLINIC MANAGEMENT' },
  notifications: { ar: 'الإشعارات', en: 'Notifications' },
  new: { ar: 'جديدة', en: 'New' },
  upcomingSession: { ar: 'جلسة قادمة', en: 'Upcoming Session' },
  invoicePaid: { ar: 'فاتورة مدفوعة', en: 'Invoice Paid' },
  paymentReminder: { ar: 'تذكير بالدفع', en: 'Payment Reminder' },
  weeklyReminderDesc: { ar: 'موعد تحصيل الدفعات الأسبوعية (كل يوم أحد)', en: 'Weekly payments collection (Every Sunday)' },
  monthlyReminderDesc: { ar: 'موعد تحصيل الدفعات الشهرية (نهاية الشهر)', en: 'Monthly payments collection (End of Month)' },
  financialOverview: { ar: 'نظرة مالية', en: 'Financial Overview' },
  revenueByCompany: { ar: 'الدخل حسب الشركة', en: 'Revenue by Company' },
  sessionsByService: { ar: 'الجلسات حسب الخدمة', en: 'Sessions by Service' },
  reportSummary: { ar: 'ملخص التقرير', en: 'Report Summary' },
  totalAmount: { ar: 'المبلغ الإجمالي', en: 'Total Amount' },
  paidAmount: { ar: 'المبلغ المدفوع', en: 'Paid Amount' },
  remainingAmount: { ar: 'المبلغ المتبقي', en: 'Remaining Amount' },
  generateReport: { ar: 'توليد التقرير', en: 'Generate Report' },
  noDataFound: { ar: 'لا توجد بيانات', en: 'No data found' },
  service: { ar: 'الخدمة', en: 'Service' },
  allCompanies: { ar: 'كل الشركات', en: 'All Companies' },
  allServices: { ar: 'كل الخدمات', en: 'All Services' },
  reset: { ar: 'إعادة تعيين', en: 'Reset' },
  monthlyRevenueChart: { ar: 'الإيرادات الشهرية', en: 'Monthly Revenue' },
  serviceDistribution: { ar: 'توزيع الخدمات', en: 'Service Distribution' },
  recentSessions: { ar: 'آخر الجلسات المسجلة', en: 'Recent Sessions' },
  viewAll: { ar: 'عرض الكل', en: 'View All' },
  patient: { ar: 'المريض', en: 'Patient' },
  company: { ar: 'الشركة', en: 'Company' },
  date: { ar: 'التاريخ', en: 'Date' },
  status: { ar: 'الحالة', en: 'Status' },
  contactPerson: { ar: 'الشخص المسؤول', en: 'Contact Person' },
  outstanding: { ar: 'المستحقات', en: 'Outstanding' },
  sessionsCount: { ar: 'الجلسات', en: 'Sessions' },
  sessionsPerformed: { ar: 'الجلسات المنجزة', en: 'Sessions Performed' },
  id: { ar: 'المعرف', en: 'ID' },
  period: { ar: 'الفترة', en: 'Period' },
  excel: { ar: 'إكسل', en: 'Excel' },
  pdf: { ar: 'بي دي إف', en: 'PDF' },
  month: { ar: 'الشهر', en: 'Month' },
  year: { ar: 'السنة', en: 'Year' },
  reportType: { ar: 'نوع التقرير', en: 'Report Type' },
  updateReport: { ar: 'تحديث التقرير', en: 'Update Report' },
  financialReportSummary: { ar: 'ملخص التقرير المالي', en: 'Financial Report Summary' },
  total: { ar: 'الإجمالي', en: 'Total' },
  remaining: { ar: 'المتبقي', en: 'Remaining' },
  today: { ar: 'اليوم', en: 'Today' },
  week: { ar: 'أسبوع', en: 'Week' },
  monthView: { ar: 'شهر', en: 'Month' },
  more: { ar: 'أخرى', en: 'more' },
  settingsDesc: { ar: 'تخصيص إعدادات العيادة والنظام', en: 'Customize clinic and system settings' },
  edit: { ar: 'تعديل', en: 'Edit' },
  saveData: { ar: 'حفظ البيانات', en: 'Save Data' },
  delete: { ar: 'حذف', en: 'Delete' },
  deleteConfirm: { ar: 'هل أنت متأكد من الحذف؟', en: 'Are you sure you want to delete?' },
  selectMethod: { ar: 'اختر الطريقة', en: 'Select Method' },
  selectCompany: { ar: 'اختر الشركة', en: 'Select Company' },
  selectTherapist: { ar: 'اختر المعالج', en: 'Select Therapist' },
  selectPatient: { ar: 'اختر المريض', en: 'Select Patient' },
  serviceType: { ar: 'نوع الخدمة', en: 'Service Type' },
  pricePerSession: { ar: 'سعر الجلسة', en: 'Price Per Session' },
  startDate: { ar: 'تاريخ البدء', en: 'Start Date' },
  notes: { ar: 'ملاحظات', en: 'Notes' },
  specialty: { ar: 'التخصص', en: 'Specialty' },
  sessionNumber: { ar: 'رقم الجلسة', en: 'Session Number' },
  sessionDate: { ar: 'تاريخ الجلسة', en: 'Session Date' },
  amountPaid: { ar: 'المبلغ المدفوع', en: 'Amount Paid' },
  physiotherapy: { ar: 'علاج طبيعي', en: 'Physiotherapy' },
  nurseVisit: { ar: 'زيارة ممرضة', en: 'Nurse Visit' },
  doctorVisit: { ar: 'زيارة طبيب', en: 'Doctor Visit' },
  caregiver: { ar: 'مقدم رعاية', en: 'Caregiver' },
  others: { ar: 'أخرى', en: 'Others' },
  billingMethod: { ar: 'طريقة الفوترة', en: 'Billing Method' },
  assignedTherapist: { ar: 'المعالج المسؤول', en: 'Assigned Therapist' },
  therapist: { ar: 'المعالج', en: 'Therapist' },
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
  companyName: { ar: 'اسم الشركة', en: 'Company Name' },
  patientName: { ar: 'اسم المريض', en: 'Patient Name' },
  therapistName: { ar: 'اسم المعالج', en: 'Therapist Name' },
  email: { ar: 'البريد الإلكتروني', en: 'Email' },
  financialReport: { ar: 'تقرير مالي شهري', en: 'Monthly Financial Report' },
  companySessionsReport: { ar: 'تقرير جلسات الشركة', en: 'Company Sessions Report' },
  patientProgressReport: { ar: 'تقرير تقدم المرضى', en: 'Patient Progress Report' },
  sun: { ar: 'الأحد', en: 'Sunday' },
  mon: { ar: 'الاثنين', en: 'Monday' },
  tue: { ar: 'الثلاثاء', en: 'Tuesday' },
  wed: { ar: 'الأربعاء', en: 'Wednesday' },
  thu: { ar: 'الخميس', en: 'Thursday' },
  fri: { ar: 'الجمعة', en: 'Friday' },
  sat: { ar: 'السبت', en: 'Saturday' },
  sunShort: { ar: 'أحد', en: 'Sun' },
  monShort: { ar: 'اثنين', en: 'Mon' },
  tueShort: { ar: 'ثلاثاء', en: 'Tue' },
  wedShort: { ar: 'أربعاء', en: 'Wed' },
  thuShort: { ar: 'خميس', en: 'Thu' },
  friShort: { ar: 'جمعة', en: 'Fri' },
  satShort: { ar: 'سبت', en: 'Sat' },
  services: { ar: 'الخدمات', en: 'Services' },
  addService: { ar: 'إضافة خدمة', en: 'Add Service' },
  serviceName: { ar: 'اسم الخدمة', en: 'Service Name' },
  description: { ar: 'الوصف', en: 'Description' },
  basePrice: { ar: 'السعر الأساسي', en: 'Base Price' },
  companyPrices: { ar: 'أسعار الخدمات للشركة', en: 'Company Service Prices' },
  setPrice: { ar: 'تحديد السعر', en: 'Set Price' },
  price: { ar: 'السعر', en: 'Price' },
};

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [lang, setLang] = useState<Language>('ar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [companyPrices, setCompanyPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [dashboardFilters, setDashboardFilters] = useState<any>({});
  const [reportFilters, setReportFilters] = useState<any>({ company: 'all', month: '03', year: '2026' });
  const [settings, setSettings] = useState<any>({
    clinicName: 'كير تراكر',
    currency: 'SAR',
    address: 'الرياض، المملكة العربية السعودية',
    phone: '+966 50 000 0000'
  });

  // Modals
  const [showModal, setShowModal] = useState<Tab | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [showCompanyPrices, setShowCompanyPrices] = useState<number | null>(null);

  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, type: 'session', title: 'upcomingSession', desc: 'Ahmed Ali - 4:00 PM', time: '5m ago', read: false },
    { id: 2, type: 'invoice', title: 'invoicePaid', desc: 'Aramco - Invoice #1024', time: '2h ago', read: true },
    { id: 3, type: 'balance', title: 'balanceAlert', desc: 'SABIC exceeded balance limit', time: '1d ago', read: false },
  ]);

  const markNotificationRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const t = (key: string) => translations[key]?.[lang] || key;
  const isRtl = lang === 'ar';

  const revenueData = useMemo(() => [
    { name: isRtl ? 'أكتوبر' : 'Oct', value: 45000 },
    { name: isRtl ? 'نوفمبر' : 'Nov', value: 52000 },
    { name: isRtl ? 'ديسمبر' : 'Dec', value: 48000 },
    { name: isRtl ? 'يناير' : 'Jan', value: 61000 },
    { name: isRtl ? 'فبراير' : 'Feb', value: 55000 },
    { name: isRtl ? 'مارس' : 'Mar', value: 67000 },
  ], [isRtl]);

  const uniqueServices = useMemo(() => {
    const sSet = new Set<string>();
    services.forEach(s => sSet.add(s.name));
    patients.forEach(p => {
      if (p.service_type) sSet.add(p.service_type);
    });
    return Array.from(sSet);
  }, [services, patients]);

  const serviceDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    patients.forEach(p => {
      if (p.service_type) {
        counts[p.service_type] = (counts[p.service_type] || 0) + 1;
      }
    });
    const total = patients.length || 1;
    return Object.entries(counts).map(([name, count]) => {
      const translationKey = Object.keys(translations).find(key => translations[key].ar === name);
      const service = services.find(s => s.name === name);
      return {
        name: translationKey ? t(translationKey) : (service ? service.name : name),
        value: Math.round((count / total) * 100)
      };
    });
  }, [patients, t, services]);

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4'];

  useEffect(() => {
    const savedSettings = localStorage.getItem('clinicSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    refreshData();
  }, [dashboardFilters]);

  useEffect(() => {
    if (showCompanyPrices) {
      fetch(`/api/company-prices/${showCompanyPrices}`)
        .then(res => res.json())
        .then(data => {
          const newPrices = { ...companyPrices };
          data.forEach((p: any) => {
            newPrices[`${showCompanyPrices}_${p.service_id}`] = p.price;
          });
          setCompanyPrices(newPrices);
        });
    }
  }, [showCompanyPrices]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetch(`/api/search?q=${searchQuery}`)
          .then(res => res.json())
          .then(data => setSearchResults(data));
      } else {
        setSearchResults(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    console.log("Companies state updated:", companies);
  }, [companies]);

  useEffect(() => {
    // Generate dynamic reminders
    const today = new Date();
    const isSunday = today.getDay() === 0;
    const isEndOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() === today.getDate();
    
    const newReminders: any[] = [];
    
    if (isSunday) {
      const weeklyCompanies = companies.filter(c => c.billing_method === 'weekly');
      if (weeklyCompanies.length > 0) {
        newReminders.push({
          id: Date.now() + 1,
          type: 'balance',
          title: 'paymentReminder',
          desc: isRtl ? `تحصيل دفعات أسبوعية لـ ${weeklyCompanies.length} شركات` : `Collect weekly payments for ${weeklyCompanies.length} companies`,
          time: t('today'),
          read: false
        });
      }
    }
    
    if (isEndOfMonth) {
      const monthlyCompanies = companies.filter(c => c.billing_method === 'monthly');
      if (monthlyCompanies.length > 0) {
        newReminders.push({
          id: Date.now() + 2,
          type: 'balance',
          title: 'paymentReminder',
          desc: isRtl ? `تحصيل دفعات شهرية لـ ${monthlyCompanies.length} شركات` : `Collect monthly payments for ${monthlyCompanies.length} companies`,
          time: t('today'),
          read: false
        });
      }
    }
    
    if (newReminders.length > 0) {
      setNotifications(prev => {
        // Avoid duplicates for the same day
        const hasTodayReminder = prev.some(n => n.title === 'paymentReminder' && n.time === t('today'));
        if (hasTodayReminder) return prev;
        return [...newReminders, ...prev];
      });
    }
  }, [companies, isRtl, t]);

  const refreshData = async (retries = 3) => {
    setLoading(true);
    try {
      const filterParams = new URLSearchParams(dashboardFilters).toString();
      const endpoints = [
        { key: 'stats', url: `/api/stats?${filterParams}` },
        { key: 'companies', url: `/api/companies` },
        { key: 'patients', url: `/api/patients?${filterParams}` },
        { key: 'therapists', url: `/api/therapists` },
        { key: 'sessions', url: `/api/sessions?${filterParams}` },
        { key: 'invoices', url: `/api/invoices?${filterParams}` },
        { key: 'services', url: `/api/services` }
      ];

      const results = await Promise.all(
        endpoints.map(e => fetch(e.url).then(async res => {
          if (res.status === 503 && retries > 0) {
            // Wait a bit and retry if DB is still initializing
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetch(e.url);
          }
          return res;
        }))
      );
      
      const [sRes, cRes, pRes, tRes, sessRes, invRes, servRes] = results;
      
      if (sRes.ok) setStats(await sRes.json());
      if (cRes.ok) setCompanies(await cRes.json());
      if (pRes.ok) setPatients(await pRes.json());
      if (tRes.ok) setTherapists(await tRes.json());
      if (sessRes.ok) setSessions(await sessRes.json());
      if (invRes.ok) setInvoices(await invRes.json());
      if (servRes.ok) setServices(await servRes.json());
    } catch (e) { 
      console.error("Refresh data failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let endpoint = '';
    let body = { ...formData };

    if (showModal === 'companies') endpoint = '/api/companies';
    if (showModal === 'patients') endpoint = '/api/patients';
    if (showModal === 'therapists') endpoint = '/api/therapists';
    if (showModal === 'sessions') endpoint = '/api/sessions';
    if (showModal === 'invoices') endpoint = '/api/invoices';
    if (showModal === 'services') endpoint = '/api/services';

    if (!endpoint) {
      console.error("No endpoint found for modal:", showModal);
      return;
    }

    if (editingId) {
      endpoint = `${endpoint}/${editingId}`;
    } else if (showModal === 'invoices') {
      endpoint = '/api/invoices/generate';
    }

    setLoading(true);
    try {
      console.log("Submitting to:", endpoint, "Body:", body);
      const res = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        const currentModal = showModal;
        const totalSessions = formData.total_sessions;
        
        setShowModal(null);
        setEditingId(null);
        setFormData({});
        refreshData();

        if (currentModal === 'patients' && totalSessions > 1 && !editingId) {
          setActiveTab('sessions');
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
        console.error("Server error:", errorData);
        alert(isRtl ? `خطأ: ${errorData.error || 'فشل في حفظ البيانات'}` : `Error: ${errorData.error || 'Failed to save data'}`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert(isRtl ? 'خطأ في الاتصال بالخادم' : 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (tab: Tab, item: any) => {
    setEditingId(item.id);
    let data = { ...item };
    if (tab === 'sessions' && item.patient_id) {
      const patient = patients.find(p => p.id === item.patient_id);
      if (patient) data.company_id = patient.company_id;
    }
    setFormData(data);
    setShowModal(tab);
  };

  const handleDelete = async () => {
    if (!editingId || !showModal) return;
    if (!window.confirm(isRtl ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;

    let endpoint = '';
    if (showModal === 'companies') endpoint = `/api/companies/${editingId}`;
    if (showModal === 'patients') endpoint = `/api/patients/${editingId}`;
    if (showModal === 'therapists') endpoint = `/api/therapists/${editingId}`;
    if (showModal === 'sessions') endpoint = `/api/sessions/${editingId}`;
    if (showModal === 'invoices') endpoint = `/api/invoices/${editingId}`;
    if (showModal === 'services') endpoint = `/api/services/${editingId}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        setShowModal(null);
        setEditingId(null);
        setFormData({});
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openDeleteConfirm = (tab: Tab, id: number) => {
    setEditingId(id);
    setShowModal(tab); // We use the modal state to know what we're deleting
    // But we need a way to trigger delete without opening the full edit form
    // Actually, handleDelete already uses editingId and showModal.
    // Let's just call handleDelete directly if we want, but it has a confirm.
  };

  const handleDeleteDirect = async (tab: Tab, id: number) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
    
    let endpoint = '';
    if (tab === 'companies') endpoint = `/api/companies/${id}`;
    if (tab === 'patients') endpoint = `/api/patients/${id}`;
    if (tab === 'therapists') endpoint = `/api/therapists/${id}`;
    if (tab === 'sessions') endpoint = `/api/sessions/${id}`;
    if (tab === 'invoices') endpoint = `/api/invoices/${id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        refreshData();
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Failed to delete' }));
        alert(isRtl ? `خطأ: ${errorData.error}` : `Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert(isRtl ? 'خطأ في الاتصال' : 'Connection error');
    }
  };

  const toggleLang = () => setLang(l => l === 'ar' ? 'en' : 'ar');

  return (
    <div 
      className={cn(
        "min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex flex-col md:flex-row transition-all duration-300 relative overflow-hidden",
        isRtl ? "rtl" : "ltr"
      )} 
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 bottom-0 z-50 w-72 bg-gradient-to-b from-white to-slate-50 border-gray-100 transition-all duration-500 flex flex-col shadow-2xl lg:shadow-none",
        isRtl ? "right-0 border-l" : "left-0 border-r",
        isSidebarOpen ? "translate-x-0" : (isRtl ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0")
      )}>
        <div className="p-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-800 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-violet-100">
              <Stethoscope size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tighter">{settings.clinicName}</h1>
              <p className="text-[10px] font-black text-violet-600 tracking-[0.2em] uppercase">{t('clinicManagement')}</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto py-4">
          <NavItem icon={<LayoutDashboard size={22} />} label={t('dashboard')} active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<Building2 size={22} />} label={t('companies')} active={activeTab === 'companies'} onClick={() => { setActiveTab('companies'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<Users size={22} />} label={t('patients')} active={activeTab === 'patients'} onClick={() => { setActiveTab('patients'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<UserCheck size={22} />} label={t('therapists')} active={activeTab === 'therapists'} onClick={() => { setActiveTab('therapists'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<Briefcase size={22} />} label={t('services')} active={activeTab === 'services'} onClick={() => { setActiveTab('services'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<Clock size={22} />} label={t('sessions')} active={activeTab === 'sessions'} onClick={() => { setActiveTab('sessions'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<DollarSign size={22} />} label={t('invoices')} active={activeTab === 'invoices'} onClick={() => { setActiveTab('invoices'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<CalendarIconLucide size={22} />} label={t('calendar')} active={activeTab === 'calendar'} onClick={() => { setActiveTab('calendar'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<FileText size={22} />} label={t('reports')} active={activeTab === 'reports'} onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<Bell size={22} />} label={t('notifications')} active={activeTab === 'notifications'} onClick={() => { setActiveTab('notifications'); setIsSidebarOpen(false); }} isRtl={isRtl} />
          <NavItem icon={<SettingsIcon size={22} />} label={t('settings')} active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} isRtl={isRtl} />
        </nav>

        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={toggleLang}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-indigo-600" />
              <span className="text-sm font-bold">{t('language')}</span>
            </div>
            {isRtl ? <ChevronLeft size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
          </button>
          
          <div className="pt-2 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
              {isRtl ? 'صنع abdulaziz sindi' : 'Made by abdulaziz sindi'}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-[1600px] mx-auto w-full lg:ms-72">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 bg-white border border-gray-200 rounded-2xl text-gray-500 shadow-sm"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">{t(activeTab)}</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mt-1">
                <span>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", isRtl ? "right-4" : "left-4")} size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')} 
                className={cn(
                  "bg-white border border-gray-200 rounded-2xl py-3 w-full lg:w-80 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm font-medium",
                  isRtl ? "pr-12 pl-4" : "pl-12 pr-4"
                )}
              />
              {searchResults && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  {searchResults.patients.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('patients')}</h4>
                      {searchResults.patients.map((p: any) => (
                        <div key={p.id} className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer font-bold text-sm" onClick={() => { setActiveTab('patients'); setSearchQuery(''); }}>{p.name}</div>
                      ))}
                    </div>
                  )}
                  {searchResults.companies.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('companies')}</h4>
                      {searchResults.companies.map((c: any) => (
                        <div key={c.id} className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer font-bold text-sm" onClick={() => { setActiveTab('companies'); setSearchQuery(''); }}>{c.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all shadow-sm relative"
                >
                  <Bell size={22} />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 left-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                          "absolute top-full mt-4 w-80 bg-white border border-gray-100 rounded-[2rem] shadow-2xl z-50 p-6 space-y-4",
                          isRtl ? "left-0" : "right-0"
                        )}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-black text-gray-900">{t('notifications')}</h4>
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                            {notifications.filter(n => !n.read).length} {t('new')}
                          </span>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {notifications.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 py-4">{isRtl ? 'لا توجد إشعارات' : 'No notifications'}</p>
                          ) : (
                            notifications.slice(0, 5).map(n => (
                              <NotificationItem 
                                key={n.id}
                                icon={
                                  n.type === 'session' ? <Clock className="text-amber-500" size={16} /> :
                                  n.type === 'invoice' ? <DollarSign className="text-emerald-500" size={16} /> :
                                  <AlertCircle className="text-red-500" size={16} />
                                }
                                title={t(n.title)}
                                desc={n.desc}
                                time={n.time}
                                read={n.read}
                                onClick={() => {
                                  markNotificationRead(n.id);
                                  setShowNotifications(false);
                                  setActiveTab('notifications');
                                }}
                              />
                            ))
                          )}
                        </div>
                        <button 
                          onClick={() => { setShowNotifications(false); setActiveTab('notifications'); }}
                          className="w-full py-3 text-xs font-black text-gray-400 hover:text-indigo-600 transition-colors border-t border-gray-50 mt-2"
                        >
                          {t('viewAllAlerts')}
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[150px] space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('companies')}</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-violet-500"
                    onChange={(e) => setDashboardFilters({...dashboardFilters, company_id: e.target.value})}
                  >
                    <option value="">{t('allCompanies')}</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[150px] space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('service')}</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-violet-500"
                    onChange={(e) => setDashboardFilters({...dashboardFilters, service_type: e.target.value})}
                  >
                    <option value="">{t('allServices')}</option>
                    {uniqueServices.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => setDashboardFilters({})}
                  className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
                >
                  {t('reset')}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Building2 />} label={t('totalCompanies')} value={stats?.totalCompanies || 0} color="blue" />
                <StatCard icon={<Users />} label={t('totalPatients')} value={stats?.totalPatients || 0} color="emerald" />
                <StatCard icon={<UserCheck />} label={t('totalTherapists')} value={stats?.totalTherapists || 0} color="violet" />
                <StatCard icon={<CheckCircle2 />} label={t('completedSessions')} value={stats?.totalSessionsCompleted || 0} color="orange" />
                <StatCard icon={<Clock />} label={t('remainingSessions')} value={stats?.remainingSessions || 0} color="amber" />
                <StatCard icon={<DollarSign />} label={t('monthlyRevenue')} value={`${(stats?.monthlyRevenue || 0).toLocaleString()} ر.س`} color="purple" />
                <StatCard icon={<AlertCircle />} label={t('outstandingBalance')} value={`${(stats?.outstandingBalance || 0).toLocaleString()} ر.س`} color="red" />
                <StatCard icon={<TrendingUp />} label={t('sessions')} value={sessions.length} color="cyan" />
              </div>

              {/* Financial Overview Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black">{t('revenueByCompany')}</h3>
                    <TrendingUp className="text-emerald-500" size={24} />
                  </div>
                  <div className="space-y-6">
                    {companies.slice(0, 5).map((company, index) => {
                      const revenue = invoices.filter(i => i.company_id === company.id).reduce((sum, i) => sum + i.total_amount, 0);
                      const maxRevenue = Math.max(...companies.map(c => invoices.filter(i => i.company_id === c.id).reduce((sum, i) => sum + i.total_amount, 0)), 1);
                      const percentage = (revenue / maxRevenue) * 100;
                      
                      return (
                        <div key={company.id} className="space-y-2">
                          <div className="flex justify-between text-sm font-bold">
                            <span className="text-gray-700">{company.name}</span>
                            <span className="text-violet-700">{revenue.toLocaleString()} {settings.currency}</span>
                          </div>
                          <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full bg-violet-600 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black">{t('sessionsByService')}</h3>
                    <TrendingUp className="text-violet-600" size={24} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {serviceDistribution.map((item, index) => (
                      <div key={item.name} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest truncate">{item.name}</span>
                        </div>
                        <p className="text-xl font-black text-gray-900">{item.value}</p>
                        <p className="text-[10px] font-bold text-gray-400">{((item.value / sessions.length) * 100).toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black">{t('monthlyRevenueChart')}</h3>
                    <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                      <option>2026</option>
                      <option>2025</option>
                    </select>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: '#F8FAFC' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                          {revenueData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 5 ? '#4F46E5' : '#E2E8F0'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black mb-8">{t('serviceDistribution')}</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {serviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 mt-4">
                    {serviceDistribution.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="font-bold text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-black">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">{t('recentSessions')}</h3>
                  <button onClick={() => setActiveTab('sessions')} className="text-violet-700 text-sm font-bold hover:underline">{t('viewAll')}</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-50">
                        <th className="pb-4 pr-4">{t('patient')}</th>
                        <th className="pb-4">{t('company')}</th>
                        <th className="pb-4">{t('service')}</th>
                        <th className="pb-4">{t('therapist')}</th>
                        <th className="pb-4">{t('date')}</th>
                        <th className="pb-4 pl-4">{t('status')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                      {sessions.slice(0, 5).map((session, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-5 pr-4">{session.patient_name}</td>
                          <td className="py-5 text-gray-500">{session.company_name}</td>
                          <td className="py-5">
                            <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-[10px]">{session.service_type}</span>
                          </td>
                          <td className="py-5 text-gray-500">{session.therapist_name}</td>
                          <td className="py-5 text-gray-400">{session.session_date}</td>
                          <td className="py-5 pl-4">
                            <StatusBadge status={session.status} lang={lang} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'companies' && (
            <motion.div 
              key="companies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">{t('companies')}</h3>
                <button 
                  onClick={() => {
                    setFormData({});
                    setEditingId(null);
                    setShowModal('companies');
                  }} 
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  <Plus size={20} />
                  <span>{t('addCompany')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {companies.length === 0 ? (
                  <div className="md:col-span-2 lg:col-span-3 py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                    <Building2 size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">{isRtl ? 'لا توجد شركات مضافة' : 'No companies added'}</p>
                  </div>
                ) : (
                  companies.map((company) => (
                    <div key={company.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Building2 size={28} />
                        </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setShowCompanyPrices(company.id)}
                                className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                                title={t('companyPrices')}
                              >
                                <DollarSign size={16} />
                              </button>
                              <button 
                                onClick={() => openEditModal('companies', company)}
                                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                              >
                                <FileText size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteDirect('companies', company.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                              {company.billing_method === 'monthly' ? t('billingMonthly') : 
                               company.billing_method === 'weekly' ? t('billingWeekly') : 
                               t('billingAfter')}
                            </span>
                          </div>
                      </div>
                      <h4 className="font-black text-2xl mb-2 text-gray-900">{company.name}</h4>
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-gray-500">
                          <User size={16} />
                          <span className="text-sm font-medium">{company.contact_person}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                          <Phone size={16} />
                          <span className="text-sm font-medium" dir="ltr">{company.phone}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('patients')}</p>
                          <p className="font-black text-lg text-violet-700">{company.patient_count}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('outstanding')}</p>
                          <p className="font-black text-lg text-red-500">{(company.unpaid_balance || 0).toLocaleString()} <span className="text-[10px]">{settings.currency}</span></p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'patients' && (
            <motion.div 
              key="patients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">{t('patients')}</h3>
                <button onClick={() => setShowModal('patients')} className="flex items-center gap-2 bg-violet-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-violet-100 hover:bg-violet-800 transition-all">
                  <Plus size={20} />
                  <span>{t('addPatient')}</span>
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-50">
                        <th className="py-6 pr-8">{t('patient')}</th>
                        <th className="py-6">{t('company')}</th>
                        <th className="py-6">{t('service')}</th>
                        <th className="py-6">{t('therapist')}</th>
                        <th className="py-6">{t('sessionsCount')}</th>
                        <th className="py-6">{t('status')}</th>
                        <th className="py-6 pl-8"></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-6 pr-8">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-700">
                                <User size={20} />
                              </div>
                              <span className="text-gray-900">{patient.name}</span>
                            </div>
                          </td>
                          <td className="py-6 text-gray-500">{patient.company_name}</td>
                          <td className="py-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px]">{patient.service_type}</span>
                          </td>
                          <td className="py-6 text-gray-500">{patient.therapist_name}</td>
                          <td className="py-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-gray-400">{patient.completed_sessions} / {patient.total_sessions}</span>
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-violet-600" 
                                  style={{ width: `${(patient.completed_sessions / patient.total_sessions) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-6">
                            <StatusBadge status={patient.status} lang={lang} />
                          </td>
                          <td className="py-6 pl-8 text-left">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openEditModal('patients', patient)}
                                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                              >
                                <FileText size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteDirect('patients', patient.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'therapists' && (
            <motion.div 
              key="therapists"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">{t('therapists')}</h3>
                <button onClick={() => setShowModal('therapists')} className="flex items-center gap-2 bg-violet-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-violet-100 hover:bg-violet-800 transition-all">
                  <Plus size={20} />
                  <span>{t('addTherapist')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {therapists.map((therapist) => (
                  <div key={therapist.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-700 group-hover:bg-violet-700 group-hover:text-white transition-colors">
                        <ShieldCheck size={28} />
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal('therapists', therapist)}
                          className="p-2 text-gray-400 hover:text-violet-700 transition-colors"
                        >
                          <FileText size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDirect('therapists', therapist.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-black text-2xl mb-2 text-gray-900">{therapist.name}</h4>
                    <p className="text-sm font-bold text-violet-600 mb-6">{therapist.specialty}</p>
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Phone size={16} />
                        <span className="text-sm font-medium" dir="ltr">{therapist.phone}</span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-50">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('sessionsPerformed')}</p>
                      <p className="font-black text-lg text-violet-700">{therapist.session_count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div 
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">{t('services')}</h3>
                <button onClick={() => setShowModal('services')} className="flex items-center gap-2 bg-violet-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-violet-100 hover:bg-violet-800 transition-all">
                  <Plus size={20} />
                  <span>{t('addService')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <div key={service.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-700 group-hover:bg-violet-700 group-hover:text-white transition-colors">
                        <Briefcase size={28} />
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal('services', service)}
                          className="p-2 text-gray-400 hover:text-violet-700 transition-colors"
                        >
                          <FileText size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDirect('services', service.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-black text-2xl mb-2 text-gray-900">{service.name}</h4>
                    <p className="text-sm font-medium text-gray-500 mb-6 line-clamp-2">{service.description}</p>
                    <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('basePrice')}</p>
                        <p className="font-black text-lg text-violet-700">{service.base_price} {settings.currency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'sessions' && (
            <motion.div 
              key="sessions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">{t('sessions')}</h3>
                <button onClick={() => setShowModal('sessions')} className="flex items-center gap-2 bg-violet-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-violet-100 hover:bg-violet-800 transition-all">
                  <Plus size={20} />
                  <span>{t('addSession')}</span>
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-50">
                        <th className="py-6 pr-8">{t('patient')}</th>
                        <th className="py-6">{t('company')}</th>
                        <th className="py-6">{t('service')}</th>
                        <th className="py-6">{t('therapist')}</th>
                        <th className="py-6">{t('date')}</th>
                        <th className="py-6">{t('status')}</th>
                        <th className="py-6 pl-8"></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                      {sessions.map((session) => (
                        <tr key={session.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-6 pr-8">{session.patient_name}</td>
                          <td className="py-6 text-gray-500">{session.company_name}</td>
                          <td className="py-6">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px]">{session.service_type}</span>
                          </td>
                          <td className="py-6 text-gray-500">{session.therapist_name}</td>
                          <td className="py-6 text-gray-400">{session.session_date}</td>
                          <td className="py-6">
                            <StatusBadge status={session.status} lang={lang} />
                          </td>
                          <td className="py-6 pl-8 text-left">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openEditModal('sessions', session)}
                                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                              >
                                <FileText size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteDirect('sessions', session.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'invoices' && (
            <motion.div 
              key="invoices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">{t('invoices')}</h3>
                <button onClick={() => { setFormData({ month: 3, year: 2026 }); setShowModal('invoices'); }} className="flex items-center gap-2 bg-violet-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-violet-100 hover:bg-violet-800 transition-all">
                  <Plus size={20} />
                  <span>{t('generateInvoice')}</span>
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-50">
                        <th className="py-6 pr-8">{t('id')}</th>
                        <th className="py-6">{t('company')}</th>
                        <th className="py-6">{t('period')}</th>
                        <th className="py-6">{t('sessionsCount')}</th>
                        <th className="py-6">{t('totalAmount')}</th>
                        <th className="py-6">{t('paidAmount')}</th>
                        <th className="py-6">{t('status')}</th>
                        <th className="py-6 pl-8"></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-6 pr-8 text-gray-400">#INV-{inv.id}</td>
                          <td className="py-6 text-gray-900">{inv.company_name}</td>
                          <td className="py-6 text-gray-500">{inv.month}/{inv.year}</td>
                          <td className="py-6 text-gray-500">{inv.total_sessions}</td>
                          <td className="py-6 text-gray-900">{inv.total_amount.toLocaleString()} {settings.currency}</td>
                          <td className="py-6 text-emerald-600">{inv.amount_paid.toLocaleString()} {settings.currency}</td>
                          <td className="py-6">
                            <StatusBadge status={inv.status} lang={lang} />
                          </td>
                          <td className="py-6 pl-8 text-left">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openEditModal('invoices', inv)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              >
                                <FileText size={18} />
                              </button>
                              <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                <Download size={18} />
                              </button>
                              <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                <DollarSign size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteDirect('invoices', inv.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div 
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h3 className="text-2xl font-black">{t('reports')}</h3>
                <div className="flex gap-4 w-full md:w-auto">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-black shadow-sm hover:bg-gray-50 transition-all">
                    <Download size={20} />
                    <span>Excel</span>
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    <Download size={20} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Report Filters */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('company')}</label>
                  <select 
                    value={reportFilters.company}
                    onChange={(e) => setReportFilters({...reportFilters, company: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none font-bold"
                  >
                    <option value="all">{t('allCompanies')}</option>
                    {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('month')}</label>
                  <select 
                    value={reportFilters.month}
                    onChange={(e) => setReportFilters({...reportFilters, month: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none font-bold"
                  >
                    <option value="03">03 - {isRtl ? 'مارس' : 'March'}</option>
                    <option value="02">02 - {isRtl ? 'فبراير' : 'February'}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('reportType')}</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none font-bold">
                    <option>{t('financialReport')}</option>
                    <option>{t('companySessionsReport')}</option>
                    <option>{t('patientProgressReport')}</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-black hover:bg-indigo-100 transition-all">
                    {t('updateReport')}
                  </button>
                </div>
              </div>

              {/* Report Table */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                  <h4 className="font-black text-xl">{t('financialReportSummary')}</h4>
                  <p className="text-sm text-gray-400 font-bold mt-1">{isRtl ? 'مارس 2026' : 'March 2026'}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-100">
                        <th className="py-6 pr-8">{t('company')}</th>
                        <th className="py-6">{t('totalSessions')}</th>
                        <th className="py-6">{t('totalAmount')}</th>
                        <th className="py-6">{t('paidAmount')}</th>
                        <th className="py-6">{t('remaining')}</th>
                        <th className="py-6 pl-8">{t('status')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                      {companies
                        .filter(c => reportFilters.company === 'all' || c.name === reportFilters.company)
                        .map((company) => (
                        <tr key={company.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-6 pr-8">{company.name}</td>
                          <td className="py-6 text-gray-500">
                            {sessions.filter(s => s.company_name === company.name && s.status === 'completed').length}
                          </td>
                          <td className="py-6 text-gray-900">{(company.total_revenue || 0).toLocaleString()} {settings.currency}</td>
                          <td className="py-6 text-emerald-600">{(company.total_revenue - company.unpaid_balance || 0).toLocaleString()} {settings.currency}</td>
                          <td className="py-6 text-red-500">{(company.unpaid_balance || 0).toLocaleString()} {settings.currency}</td>
                          <td className="py-6 pl-8">
                            <StatusBadge status={company.unpaid_balance > 0 ? 'partially_paid' : 'paid'} lang={lang} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-indigo-50/50 font-black text-indigo-900">
                        <td className="py-6 pr-8 border-t border-indigo-100">{t('total')}</td>
                        <td className="py-6 text-indigo-600 border-t border-indigo-100">{sessions.filter(s => s.status === 'completed').length}</td>
                        <td className="py-6 text-indigo-900 border-t border-indigo-100">{(stats?.outstandingBalance + stats?.monthlyRevenue || 0).toLocaleString()} {settings.currency}</td>
                        <td className="py-6 text-emerald-600 border-t border-indigo-100">{(stats?.monthlyRevenue || 0).toLocaleString()} {settings.currency}</td>
                        <td className="py-6 text-red-500 border-t border-indigo-100">{(stats?.outstandingBalance || 0).toLocaleString()} {settings.currency}</td>
                        <td className="py-6 pl-8 border-t border-indigo-100"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div 
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
                    {isRtl ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                  </button>
                  <h3 className="text-2xl font-black">{isRtl ? 'مارس 2026' : 'March 2026'}</h3>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
                    {isRtl ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                  </button>
                </div>
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                  <button className="whitespace-nowrap px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold">{t('today')}</button>
                  <button className="whitespace-nowrap px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-sm font-bold">{t('week')}</button>
                  <button className="whitespace-nowrap px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">{t('monthView')}</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-3xl overflow-hidden">
                    {[t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')].map((day, i) => (
                      <div key={i} className="bg-gray-50 p-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const day = i + 1;
                      const isCurrentMonth = day <= 31;
                      const daySessions = isCurrentMonth ? sessions.filter(s => new Date(s.session_date).getDate() === day) : [];
                      
                      return (
                        <div key={i} className={cn(
                          "bg-white min-h-[120px] p-4 border-t border-gray-50 transition-all hover:bg-gray-50 cursor-pointer relative group",
                          !isCurrentMonth && "bg-gray-50/50"
                        )}>
                          <span className={cn(
                            "text-sm font-black",
                            isCurrentMonth ? "text-gray-900" : "text-gray-300",
                            day === 9 && "w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center -mt-1 -ms-1"
                          )}>{day > 31 ? day - 31 : day}</span>
                          
                          {daySessions.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {daySessions.slice(0, 2).map((s, idx) => (
                                <div 
                                  key={s.id} 
                                  className={cn(
                                    "p-1.5 text-[10px] rounded-lg font-bold truncate border shadow-sm",
                                    idx === 0 ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  )}
                                >
                                  {s.service_type} - {s.patient_name}
                                </div>
                              ))}
                              {daySessions.length > 2 && (
                                <div className="text-[8px] font-black text-indigo-400 px-1">+{daySessions.length - 2} {t('more')}</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">{t('notifications')}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                  >
                    {isRtl ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                  </button>
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-xs font-black text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
                  >
                    {isRtl ? 'حذف الكل' : 'Clear All'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-emerald-50/20 pointer-events-none" />
                {notifications.length === 0 ? (
                  <div className="p-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <Bell size={40} />
                    </div>
                    <p className="text-gray-400 font-bold">{isRtl ? 'لا توجد إشعارات حالياً' : 'No notifications at the moment'}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2">
                        <NotificationItem 
                          icon={
                            n.type === 'session' ? <Clock className="text-amber-500" size={20} /> :
                            n.type === 'invoice' ? <DollarSign className="text-emerald-500" size={20} /> :
                            <AlertCircle className="text-red-500" size={20} />
                          }
                          title={t(n.title)}
                          desc={n.desc}
                          time={n.time}
                          read={n.read}
                          onDelete={() => deleteNotification(n.id)}
                          onClick={() => markNotificationRead(n.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                    <SettingsIcon size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('settings')}</h2>
                    <p className="text-gray-500 font-medium">{t('settingsDesc')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 px-1">{t('clinicName')}</label>
                    <input 
                      type="text" 
                      value={settings.clinicName}
                      onChange={(e) => setSettings({...settings, clinicName: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 px-1">{t('currency')}</label>
                    <input 
                      type="text" 
                      value={settings.currency}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 px-1">{t('phone')}</label>
                    <input 
                      type="text" 
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 px-1">{t('address')}</label>
                    <input 
                      type="text" 
                      value={settings.address}
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      localStorage.setItem('clinicSettings', JSON.stringify(settings));
                      alert(t('settingsUpdated'));
                    }}
                    className="w-full md:w-auto px-12 bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    {t('saveSettings')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-12 py-8 border-t border-gray-100/50 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            {isRtl ? 'صنع abdulaziz sindi' : 'Made by abdulaziz sindi'}
          </p>
        </footer>
      </main>

      {/* Modals Container */}
      <AnimatePresence>
        {showCompanyPrices && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompanyPrices(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900">{t('companyPrices')}</h3>
                  <p className="text-sm font-bold text-indigo-500 mt-1">{companies.find(c => c.id === showCompanyPrices)?.name}</p>
                </div>
                <button onClick={() => setShowCompanyPrices(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {services.map(service => {
                  const currentPrice = companyPrices[`${showCompanyPrices}_${service.id}`] ?? service.base_price;
                  return (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <p className="font-black text-gray-900">{service.name}</p>
                        <p className="text-xs font-bold text-gray-400">{t('basePrice')}: {service.base_price} {settings.currency}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="number"
                          className="w-24 bg-white border border-gray-200 rounded-xl p-2 text-center font-black outline-none focus:ring-2 focus:ring-indigo-500"
                          value={currentPrice}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setCompanyPrices({ ...companyPrices, [`${showCompanyPrices}_${service.id}`]: val });
                          }}
                        />
                        <button 
                          onClick={async () => {
                            const price = companyPrices[`${showCompanyPrices}_${service.id}`] ?? service.base_price;
                            await fetch('/api/company-prices', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ company_id: showCompanyPrices, service_id: service.id, price })
                            });
                            alert(t('saveData'));
                          }}
                          className="bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600 transition-all"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowModal(null);
                setEditingId(null);
                setFormData({});
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl md:text-2xl font-black text-gray-900">
                  {editingId 
                    ? `${t('edit')} ${t(showModal.slice(0, -1) as any)}`
                    : (t(`add${showModal.charAt(0).toUpperCase() + showModal.slice(1, -1)}` as any) || t(showModal))}
                </h3>
                <button onClick={() => { setShowModal(null); setEditingId(null); setFormData({}); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {showModal === 'companies' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label={t('companyName')} value={formData.name} onChange={(v) => setFormData({...formData, name: v})} required />
                    <FormField label={t('contactPerson')} value={formData.contact_person} onChange={(v) => setFormData({...formData, contact_person: v})} />
                    <FormField label={t('phone')} value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                    <FormField label={t('email')} type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                    <div className="md:col-span-2">
                      <FormField label={t('address')} value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('billingMethod')}</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.billing_method || ''}
                        onChange={(e) => setFormData({...formData, billing_method: e.target.value})}
                        required
                      >
                        <option value="">{t('selectMethod')}</option>
                        <option value="monthly">{t('billingMonthly')}</option>
                        <option value="weekly">{t('billingWeekly')}</option>
                        <option value="completed">{t('billingAfter')}</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <FormField label={t('notes')} value={formData.notes} onChange={(v) => setFormData({...formData, notes: v})} />
                    </div>
                  </div>
                )}

                {showModal === 'patients' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label={t('patientName')} value={formData.name} onChange={(v) => setFormData({...formData, name: v})} required />
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('company')}</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.company_id}
                        onChange={async (e) => {
                          const companyId = e.target.value;
                          let price = formData.price_per_session;
                          
                          if (companyId && formData.service_type) {
                            const service = services.find(s => s.name === formData.service_type);
                            if (service) {
                              try {
                                const res = await fetch(`/api/company-prices/${companyId}`);
                                const prices = await res.json();
                                const specificPrice = prices.find((p: any) => p.service_id === service.id);
                                price = specificPrice ? specificPrice.price : service.base_price;
                              } catch (e) { console.error(e); }
                            }
                          }
                          
                          setFormData({...formData, company_id: companyId, price_per_session: price});
                        }}
                        required
                      >
                        <option value="">{t('selectCompany')}</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('assignedTherapist')}</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.therapist_id}
                        onChange={(e) => setFormData({...formData, therapist_id: e.target.value})}
                        required
                      >
                        <option value="">{t('selectTherapist')}</option>
                        {therapists.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('serviceType')}</label>
                      <div className="relative">
                        <input 
                          list="services-list"
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                          value={formData.service_type || ''}
                          onChange={async (e) => {
                            const val = e.target.value;
                            const service = services.find(s => s.name === val);
                            let price = service ? service.base_price : formData.price_per_session;
                            
                            if (formData.company_id && service) {
                              try {
                                const res = await fetch(`/api/company-prices/${formData.company_id}`);
                                const prices = await res.json();
                                const specificPrice = prices.find((p: any) => p.service_id === service.id);
                                if (specificPrice) price = specificPrice.price;
                              } catch (e) { console.error(e); }
                            }

                            setFormData({
                              ...formData, 
                              service_type: val,
                              price_per_session: price
                            });
                          }}
                          required
                        />
                        <datalist id="services-list">
                          {uniqueServices.map(s => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                    <FormField label={t('sessionsCount')} type="number" value={formData.total_sessions} onChange={(v) => setFormData({...formData, total_sessions: v})} required />
                    <FormField label={t('pricePerSession')} type="number" value={formData.price_per_session} onChange={(v) => setFormData({...formData, price_per_session: v})} required />
                    <FormField label={t('startDate')} type="date" value={formData.start_date} onChange={(v) => setFormData({...formData, start_date: v})} required />
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('status')}</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        required
                      >
                        <option value="active">{t('statusActive')}</option>
                        <option value="completed">{t('statusCompleted')}</option>
                        <option value="paused">{t('statusPaused')}</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <FormField label={t('notes')} value={formData.notes} onChange={(v) => setFormData({...formData, notes: v})} />
                    </div>
                  </div>
                )}

                {showModal === 'therapists' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label={t('therapistName')} value={formData.name} onChange={(v) => setFormData({...formData, name: v})} required />
                    <FormField label={t('specialty')} value={formData.specialty} onChange={(v) => setFormData({...formData, specialty: v})} required />
                    <FormField label={t('phone')} value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} required />
                  </div>
                )}

                {showModal === 'services' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label={t('serviceName')} value={formData.name} onChange={(v) => setFormData({...formData, name: v})} required />
                    <FormField label={t('basePrice')} type="number" value={formData.base_price} onChange={(v) => setFormData({...formData, base_price: v})} required />
                    <div className="md:col-span-2">
                      <FormField label={t('description')} value={formData.description} onChange={(v) => setFormData({...formData, description: v})} />
                    </div>
                  </div>
                )}

                {showModal === 'sessions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('company')}</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.company_id || ''}
                        onChange={(e) => setFormData({...formData, company_id: e.target.value, patient_id: ''})}
                      >
                        <option value="">{t('allCompanies')}</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('patient')}</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.patient_id || ''}
                        onChange={(e) => {
                          const p = patients.find(p => p.id.toString() === e.target.value);
                          setFormData({
                            ...formData, 
                            patient_id: e.target.value,
                            therapist_id: p?.therapist_id || formData.therapist_id,
                            company_id: p?.company_id || formData.company_id
                          });
                        }}
                        required
                      >
                        <option value="">{t('selectPatient')}</option>
                        {patients
                          .filter(p => !formData.company_id || p.company_id.toString() === formData.company_id.toString())
                          .map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                        }
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('therapist')}</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.therapist_id}
                        onChange={(e) => setFormData({...formData, therapist_id: e.target.value})}
                        required
                      >
                        <option value="">{t('selectTherapist')}</option>
                        {therapists.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <FormField label={t('sessionDate')} type="date" value={formData.session_date} onChange={(v) => setFormData({...formData, session_date: v})} required />
                    <FormField label={t('sessionNumber')} type="number" value={formData.session_number} onChange={(v) => setFormData({...formData, session_number: v})} required />
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('status')}</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.status || 'completed'}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        required
                      >
                        <option value="completed">{t('statusCompleted')}</option>
                        <option value="pending">{t('pending')}</option>
                        <option value="cancelled">{t('cancelled')}</option>
                      </select>
                    </div>
                  </div>
                )}

                {showModal === 'invoices' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700">{t('company')}</label>
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.company_id}
                        onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                        required
                        disabled={!!editingId}
                      >
                        <option value="">{t('selectCompany')}</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    {!editingId && (
                      <>
                        <FormField label={t('month')} type="number" value={formData.month} onChange={(v) => setFormData({...formData, month: v})} required />
                        <FormField label={t('year')} type="number" value={formData.year} onChange={(v) => setFormData({...formData, year: v})} required />
                      </>
                    )}
                    {editingId && (
                      <>
                        <FormField label={t('amountPaid')} type="number" value={formData.amount_paid} onChange={(v) => setFormData({...formData, amount_paid: v})} required />
                        <div className="space-y-2">
                          <label className="text-sm font-black text-gray-700">{t('status')}</label>
                          <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            required
                          >
                            <option value="unpaid">{t('unpaid')}</option>
                            <option value="partially_paid">{t('partiallyPaid')}</option>
                            <option value="paid">{t('paid')}</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                    {t('saveData')}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={handleDelete}
                      className="px-8 bg-red-50 text-red-600 py-5 rounded-2xl font-black hover:bg-red-100 transition-all active:scale-95"
                    >
                      {t('delete')}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Subcomponents ---

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
  read?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  icon, 
  title, 
  desc, 
  time, 
  read, 
  onDelete, 
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-start gap-4 p-3 rounded-2xl transition-all cursor-pointer group relative",
        read ? "opacity-60" : "bg-indigo-50/30"
      )}
    >
      {!read && <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full"></div>}
      <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500 truncate">{desc}</p>
        <p className="text-[10px] text-gray-400 mt-1">{time}</p>
      </div>
      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 text-gray-300 hover:text-red-500 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isRtl }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, isRtl: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group w-full relative overflow-hidden",
        active 
          ? "bg-violet-700 text-white shadow-xl shadow-violet-100" 
          : "text-gray-400 hover:bg-violet-50/50 hover:text-violet-700",
        active && (isRtl ? "md:-translate-x-2" : "md:translate-x-2")
      )}
    >
      {active && (
        <motion.div 
          layoutId="nav-active-bg"
          className="absolute inset-0 bg-gradient-to-r from-violet-700 to-purple-900"
        />
      )}
      <span className={cn(
        "transition-colors relative z-10",
        active ? "text-white" : "text-gray-400 group-hover:text-violet-700"
      )}>{icon}</span>
      <span className="font-black text-sm tracking-tight relative z-10">{label}</span>
    </button>
  );
}

function FormField({ label, value, onChange, type = "text", required = false }: { label: string, value: any, onChange: (v: any) => void, type?: string, required?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-gray-700">{label}</label>
      <input 
        type={type}
        required={required}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
      />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  const colorMap: Record<string, { bg: string, text: string, shadow: string, border: string, cardBg: string }> = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', shadow: 'shadow-blue-100', border: 'border-blue-100', cardBg: 'bg-blue-50/30' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', shadow: 'shadow-emerald-100', border: 'border-emerald-100', cardBg: 'bg-emerald-50/30' },
    violet: { bg: 'bg-violet-600', text: 'text-violet-700', shadow: 'shadow-violet-100', border: 'border-violet-100', cardBg: 'bg-violet-50/30' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', shadow: 'shadow-orange-100', border: 'border-orange-100', cardBg: 'bg-orange-50/30' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-600', shadow: 'shadow-amber-100', border: 'border-amber-100', cardBg: 'bg-amber-50/30' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', shadow: 'shadow-purple-100', border: 'border-purple-100', cardBg: 'bg-purple-50/30' },
    red: { bg: 'bg-red-500', text: 'text-red-600', shadow: 'shadow-red-100', border: 'border-red-100', cardBg: 'bg-red-50/30' },
    cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', shadow: 'shadow-cyan-100', border: 'border-cyan-100', cardBg: 'bg-cyan-50/30' },
  };

  const c = colorMap[color] || colorMap.violet;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn("p-8 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all", c.cardBg, c.border)}
    >
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg", c.bg)}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">{label}</p>
      <h4 className="text-2xl font-black text-gray-900">{value}</h4>
    </motion.div>
  );
}

function StatusBadge({ status, lang }: { status: string, lang: Language }) {
  const config: Record<string, { bg: string, text: string, border: string, label: string }> = {
    active: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: translations.statusActive[lang] },
    completed: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: translations.statusCompleted[lang] },
    paused: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', label: translations.statusPaused[lang] },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: translations.pending[lang] },
    cancelled: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', label: translations.cancelled[lang] },
    unpaid: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', label: translations.unpaid[lang] },
    partially_paid: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', label: translations.partiallyPaid[lang] },
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: translations.paid[lang] },
  };

  const c = config[status] || config.pending;

  return (
    <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", c.bg, c.text, c.border)}>
      {c.label}
    </span>
  );
}


