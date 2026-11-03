import React, { useState, useEffect } from 'react';
import {
  FileText,
  CreditCard,
  Send,
  UserCheck,
  Layers,
  BookOpen,
  Globe,
  CheckCircle2,
  Printer,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Search,
  Lock,
  Plus,
  Trash2,
  Edit3,
  ChevronRight,
  Upload,
  Check,
  X,
  Star,
  IndianRupee,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  QrCode,
  Smartphone,
  Wallet,
  Landmark,
  Copy
} from 'lucide-react';

// Production API helpers. The backend URL is same-origin on Render.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const getAdminToken = () => localStorage.getItem('bsc_admin_token') || '';
async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}/api${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
}

// ==========================================
// SIMPLE, FAMILIAR & HIGH-CONTRAST COLOR THEME
// Designed for easy reading by all customers
// ==========================================
const COLOR_THEMES = {
  royal: {
    id: 'royal',
    name: 'Classic Trust Blue & Gold',
    badge: 'Standard Simple Theme',
    topBar: 'bg-[#1E3A8A] text-white border-blue-800',
    headerBorder: 'border-amber-400',
    logoBg: 'bg-[#1E3A8A] border-amber-400',
    activeNav: 'bg-[#1E3A8A] text-white shadow-sm',
    heroBg: 'bg-[#1E3A8A] border-amber-400',
    primaryBtn: 'bg-amber-400 hover:bg-amber-500 text-slate-900',
    cardBtn: 'bg-[#1E3A8A] hover:bg-blue-800 text-white',
    iconBox: 'bg-blue-100 text-[#1E3A8A] border-2 border-blue-300 shadow-sm',
    accentText: 'text-amber-300',
    priceColor: 'text-[#1E3A8A]',
    pageBg: 'bg-slate-50'
  }
};

// ==========================================
// SHOP CONTACT & LOCATION INFORMATION
// ==========================================
const SHOP_INFO = {
  name: 'BALAJI STATIONERY AND COMMUNICATIONS',
  tagline: 'Your Trusted Partner for Stationery, Banking Assistance and Online Services.',
  address: 'Goutham Nagar Colony, Patancheru, Sangareddy District, Telangana - 502319',
  phoneDisplay: '+91 99662 72437',
  phoneClean: '919966272437',
  hours: 'Mon – Sat: 9:00 AM – 9:30 PM | Sun: 10:00 AM – 6:00 PM',
  email: 'balajistationery.ptc@gmail.com'
};

// ==========================================
// INITIAL DEFAULT SERVICES DATA (ALL 10 SERVICES)
// ==========================================
const INITIAL_SERVICES = [
  {
    id: 'srv-pf',
    name: 'PF Withdrawal Assistance',
    category: 'Banking & Govt Portal',
    price: 150,
    priceUnit: 'per claim / application',
    quantityType: 'amount',
    iconName: 'FileText',
    requiresDoc: true,
    isCreditCard: false,
    description:
      'Complete EPFO portal assistance including UAN activation, KYC update, PF advance (Form 31), full settlement (Form 19 & 10C), and claim status check.',
    checklist: ['UAN Number & Password', 'Aadhaar linked Mobile Number', 'Bank Passbook / Cancelled Cheque']
  },
  {
    id: 'srv-cc-req',
    name: 'Credit Card Service Requests',
    category: 'Credit Card Desk',
    price: 100,
    priceUnit: 'consultation / portal guidance',
    quantityType: 'amount',
    iconName: 'CreditCard',
    requiresDoc: false,
    isCreditCard: true,
    description:
      'Safe guidance for new credit card eligibility inquiry, statement download help, EMI conversion inquiry, and official customer care dispute filing. (No sensitive card details collected).',
    checklist: ['Registered Mobile Number', 'Bank Name & Statement Copy', 'Government Photo ID']
  },
  {
    id: 'srv-money',
    name: 'Money Transfer Assistance',
    category: 'Banking Assistance',
    price: 50,
    priceUnit: 'service charge onwards',
    quantityType: 'amount',
    iconName: 'Send',
    requiresDoc: false,
    isCreditCard: false,
    description:
      'Fast and reliable Domestic Money Transfer (DMT), IMPS/NEFT banking assistance, and UPI payment guidance to any Indian bank account with instant receipt.',
    checklist: ['Recipient Account Number & IFSC', 'Sender Mobile Number', 'Cash or UPI payment']
  },
  {
    id: 'srv-pan',
    name: 'PAN Card Applications',
    category: 'Govt ID & Certificates',
    price: 200,
    priceUnit: 'per application (incl. govt fee)',
    quantityType: 'quantity',
    iconName: 'UserCheck',
    requiresDoc: true,
    isCreditCard: false,
    description:
      'New PAN card application (NSDL / UTIITSL), minor to major update, name or DOB correction, e-PAN instant download, and Aadhaar-PAN linking assistance.',
    checklist: ['Aadhaar Card', 'Passport Size Photo', 'Mobile Number linked to Aadhaar']
  },
  {
    id: 'srv-lam',
    name: 'Lamination',
    category: 'Stationery & Binding',
    price: 25,
    priceUnit: 'per sheet (A4 / ID / Legal)',
    quantityType: 'quantity',
    iconName: 'Layers',
    requiresDoc: false,
    isCreditCard: false,
    description:
      'High-durability thermal pouch lamination for Aadhaar cards, PAN cards, educational certificates, property documents, and A4/A3 sheets.',
    checklist: ['Physical Document or ID Card']
  },
  {
    id: 'srv-spiral',
    name: 'Spiral Binding',
    category: 'Stationery & Binding',
    price: 40,
    priceUnit: 'per book / project report',
    quantityType: 'quantity',
    iconName: 'BookOpen',
    requiresDoc: true,
    isCreditCard: false,
    description:
      'Neat spiral binding and soft-cover binding with transparent front PVC sheet and thick back card for B.Tech/Degree project reports, notes, and manuals.',
    checklist: ['Printed Hard Copy or PDF File on WhatsApp / Email']
  },
  {
    id: 'srv-online',
    name: 'Online Applications',
    category: 'Citizen & Exam Services',
    price: 100,
    priceUnit: 'per application form',
    quantityType: 'quantity',
    iconName: 'Globe',
    requiresDoc: true,
    isCreditCard: false,
    description:
      'TSPSC, SSC, Railway, Banking, EAMCET/NEET exam applications, Passport Seva slot booking, Income/Caste certificate forms, and scholarship registrations.',
    checklist: ['Educational Certificates', 'Photo & Signature Scan', 'Aadhaar & Caste Certificate']
  },
  {
    id: 'srv-cc-pay',
    name: 'Credit Card Payment Assistance',
    category: 'Credit Card Desk',
    price: 50,
    priceUnit: 'authorized BBPS bill desk fee',
    quantityType: 'amount',
    iconName: 'CheckCircle2',
    requiresDoc: false,
    isCreditCard: true,
    description:
      'Authorized Bharat BillPay (BBPS) credit card bill payment assistance with instant confirmation receipt. Strictly compliant—never share CVV, PIN, or OTP.',
    checklist: ['Registered Mobile Number', 'Bill Statement with Due Amount']
  },
  {
    id: 'srv-print',
    name: 'Printing and Photocopying',
    category: 'Printing & Xerox',
    price: 5,
    priceUnit: 'per page (B/W & Color options)',
    quantityType: 'quantity',
    iconName: 'Printer',
    requiresDoc: true,
    isCreditCard: false,
    description:
      'High-speed laser B/W & color printing from WhatsApp, email, or PDF upload, high-clarity Xerox/photocopying, passport photo prints, and document scanning.',
    checklist: ['Document PDF / WhatsApp File / Physical Copy']
  },
  {
    id: 'srv-custom',
    name: 'Other Custom Services',
    category: 'Stationery & General',
    price: 50,
    priceUnit: 'as per requirement',
    quantityType: 'quantity',
    iconName: 'Sparkles',
    requiresDoc: true,
    isCreditCard: false,
    description:
      'School and office stationery packs, resume/bio-data typing in English & Telugu, RTA slot booking, electricity bill payment, and custom DTP work.',
    checklist: ['Details / Notes / Reference Material']
  }
];

// ==========================================
// INITIAL SAMPLE REQUESTS FOR TRACKING DEMO
// ==========================================
const INITIAL_REQUESTS = [
  {
    id: 'BSC-2026-4810',
    customerName: 'Ramesh Kumar Goud',
    mobile: '9848011223',
    serviceId: 'srv-pf',
    serviceName: 'PF Withdrawal Assistance',
    isCreditCard: false,
    description: 'Form 31 PF advance claim for medical purpose and KYC check.',
    amountOrQty: '₹45,000 Claim',
    preferredDateTime: 'Today, 5:30 PM',
    uploadedFileName: 'UAN_Card_and_Passbook.pdf',
    status: 'In Progress',
    createdAt: '28 Oct 2026, 10:15 AM',
    adminNote: 'KYC verified on EPFO portal. Claim submission in progress.',
    paymentStatus: 'Paid Online (₹150)',
    paymentMethod: 'UPI QR Scan (GPay / PhonePe)',
    transactionRef: 'UPI629841029481',
    gatewayFeePaid: 150
  },
  {
    id: 'BSC-2026-7392',
    customerName: 'Sravani Reddy',
    mobile: '9000154321',
    serviceId: 'srv-print',
    serviceName: 'Printing and Photocopying',
    isCreditCard: false,
    description: 'B.Tech final year project report color print (45 pages) + 2 spiral bindings.',
    amountOrQty: '2 Sets (90 pages)',
    preferredDateTime: 'Today, 2:00 PM',
    uploadedFileName: 'Final_Project_Report_Sravani.pdf',
    status: 'Ready / Completed',
    createdAt: '28 Oct 2026, 09:30 AM',
    adminNote: 'Printed and spiral bound with PVC sheet. Ready for pickup at shop counter.',
    paymentStatus: 'Pay at Counter (₹10)',
    paymentMethod: 'Pay at Shop Counter',
    transactionRef: 'PAY-AT-SHOP',
    gatewayFeePaid: 0
  },
  {
    id: 'BSC-2026-9104',
    customerName: 'Mohammed Irfan',
    mobile: '9989067890',
    serviceId: 'srv-cc-pay',
    serviceName: 'Credit Card Payment Assistance',
    isCreditCard: true,
    contactMethod: 'Phone Call',
    ccServiceType: 'Credit Card Bill Payment via BBPS',
    bankIssuer: 'HDFC Bank',
    lastFourDigits: '4821',
    safeCallbackOnly: true,
    description: 'Requested safe callback to confirm BBPS payment hours before visiting shop.',
    amountOrQty: '₹18,500',
    preferredDateTime: 'Evening 6:00 PM - 7:30 PM',
    uploadedFileName: 'Card Uploads Disabled for Security',
    status: 'Pending',
    createdAt: '28 Oct 2026, 12:20 PM',
    adminNote: 'Awaiting customer callback confirmation.',
    paymentStatus: 'Gateway Excluded (CC Policy)',
    paymentMethod: 'Direct Authorized Portal / Desk',
    transactionRef: 'N/A',
    gatewayFeePaid: 0
  }
];

// ==========================================
// CUSTOMER TESTIMONIALS DATA
// ==========================================
const TESTIMONIALS = [
  {
    name: 'Praveen Kumar',
    locality: 'Goutham Nagar Colony, Patancheru',
    rating: 5,
    comment:
      'Very helpful for PF withdrawal and PAN card correction. I submitted my request online and got my EPFO claim filed in 15 minutes at the shop.'
  },
  {
    name: 'Anitha Rao',
    locality: 'BHEL Township, Patancheru',
    rating: 5,
    comment:
      'Best place in Patancheru for project report printing, spiral binding, and lamination. Sending PDF files online saves waiting time.'
  },
  {
    name: 'Syed Khaja',
    locality: 'RC Puram / Patancheru',
    rating: 5,
    comment:
      'Trustworthy shop for money transfer and online TSPSC exam applications. Transparent rates in Rupees and very polite owner.'
  }
];

export default function App() {
  // Navigation Tabs: 'home' | 'services' | 'track' | 'admin'
  const [activeTab, setActiveTab] = useState('home');

  // Simple, consistent color theme for maximum clarity
  const currentTheme = COLOR_THEMES.royal;

  // Services State (Persisted in localStorage)
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('bsc_services_v1');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bsc_services_v1', JSON.stringify(services));
    } catch (e) {
      console.error('Could not save services', e);
    }
  }, [services]);

  // Customer requests are loaded from the central PostgreSQL-backed API.
  const [requests, setRequests] = useState([]);
  const [apiReady, setApiReady] = useState(false);
  const [apiError, setApiError] = useState('');
  const refreshRequests = async () => {
    try {
      const data = await apiRequest('/requests', { method: 'GET' });
      setRequests(data.requests || []);
      setApiError('');
      setApiReady(true);
    } catch (error) {
      setApiError(error.message);
      setApiReady(false);
    }
  };


  const saveRequest = async (request) => {
    const data = await apiRequest('/requests', { method: 'POST', body: JSON.stringify(request) });
    const saved = data.request;
    setRequests((prev) => [saved, ...prev.filter((item) => item.id !== saved.id)]);
    return saved;
  };

  // Custom Business Logo Initials
  const [customLogoText, setCustomLogoText] = useState(() => {
    try {
      return localStorage.getItem('bsc_logo_text') || 'BSC';
    } catch {
      return 'BSC';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bsc_logo_text', customLogoText);
    } catch (e) {
      console.error('Could not save logo text', e);
    }
  }, [customLogoText]);

  // Active Service Request Modal State
  const [activeServiceForForm, setActiveServiceForForm] = useState(null);
  const [submittedRequestReceipt, setSubmittedRequestReceipt] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Form Fields State
  const [formState, setFormState] = useState({
    customerName: '',
    mobile: '',
    description: '',
    amountOrQty: '',
    preferredDateTime: '',
    uploadedFileName: '',
    consentPrivacy: false,
    contactMethod: 'Phone Call',
    ccServiceType: 'Credit Card Bill Payment Assistance (BBPS)',
    bankIssuer: '',
    lastFourDigits: '',
    safeCallbackOnly: false,
    ccSecurityConsent: false
  });
  const [formError, setFormError] = useState('');

  // Payment Gateway Checkout Step State (For NON-Credit Card Services Only)
  const [gatewayStep, setGatewayStep] = useState(false);
  const [pendingRequestData, setPendingRequestData] = useState(null);
  const [gatewayProcessing, setGatewayProcessing] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState('upi_qr'); // 'upi_qr' | 'upi_id' | 'razorpay_card_net' | 'pay_at_shop'
  const [upiIdInput, setUpiIdInput] = useState('');
  const [utrInput, setUtrInput] = useState('');
  const [gatewayError, setGatewayError] = useState('');

  // Merchant Payment Gateway Settings (Configurable in Admin Dashboard)
  const [gatewayConfig, setGatewayConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('bsc_gateway_config');
      return saved
        ? JSON.parse(saved)
        : {
            merchantUpiId: '9966272437@ybl',
            merchantName: 'BALAJI STATIONERY AND COMMUNICATIONS',
            gatewayProvider: 'Razorpay / BharatPe UPI Gateway',
            enableOnlineGateway: true,
            allowPayAtCounter: true
          };
    } catch {
      return {
        merchantUpiId: '9966272437@ybl',
        merchantName: 'BALAJI STATIONERY AND COMMUNICATIONS',
        gatewayProvider: 'Razorpay / BharatPe UPI Gateway',
        enableOnlineGateway: true,
        allowPayAtCounter: true
      };
    }
  });
  const [gatewaySaveMsg, setGatewaySaveMsg] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('bsc_gateway_config', JSON.stringify(gatewayConfig));
    } catch (e) {
      console.error('Failed to save gateway config', e);
    }
  }, [gatewayConfig]);

  // Request Tracking State
  const [trackInput, setTrackInput] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Admin authentication is verified by the server; no password is stored in the browser.
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [loginInputPwd, setLoginInputPwd] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminSubTab, setAdminSubTab] = useState('requests'); // 'requests' | 'services' | 'security'

  // Admin Service Editor State
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Stationery & Online',
    price: 50,
    priceUnit: 'per service',
    description: '',
    requiresDoc: true,
    isCreditCard: false
  });

  // Admin Password Change State
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [pwdChangeMessage, setPwdChangeMessage] = useState('');

  // Legal Policy Modal State ('privacy' | 'terms' | null)
  const [legalModal, setLegalModal] = useState(null);

  // Helper to render Lucide Icon by name with catchy, high-contrast visual styling
  const renderServiceIcon = (iconName, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'FileText':
        return <FileText className={className} />;
      case 'CreditCard':
        return <CreditCard className={className} />;
      case 'Send':
        return <Send className={className} />;
      case 'UserCheck':
        return <UserCheck className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      case 'Printer':
        return <Printer className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    if (status === 'Ready / Completed') {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
    if (status === 'In Progress') {
      return 'bg-blue-100 text-blue-900 border-blue-300';
    }
    return 'bg-amber-100 text-amber-900 border-amber-300';
  };

  // Open Service Form Modal
  const handleOpenServiceForm = (service) => {
    setFormError('');
    setGatewayError('');
    setSubmittedRequestReceipt(null);
    setGatewayStep(false);
    setPendingRequestData(null);
    setPaymentChoice('upi_qr');
    setUpiIdInput('');
    setUtrInput('');
    setActiveServiceForForm(service);
    setFormState({
      customerName: '',
      mobile: '',
      description: '',
      amountOrQty: '',
      preferredDateTime: '',
      uploadedFileName: '',
      consentPrivacy: false,
      contactMethod: 'Phone Call',
      ccServiceType:
        service.id === 'srv-cc-pay'
          ? 'Credit Card Bill Payment Assistance (BBPS)'
          : 'Credit Card Statement / Portal Inquiry',
      bankIssuer: '',
      lastFourDigits: '',
      safeCallbackOnly: false,
      ccSecurityConsent: false
    });
  };

  // Calculate estimated payable service fee for standard services
  const calculatePayableFee = (service, amountOrQtyText) => {
    if (!service || service.isCreditCard) return 0;
    const basePrice = Number(service.price) || 0;
    if (service.quantityType === 'quantity' && amountOrQtyText) {
      const match = amountOrQtyText.match(/\d+/);
      if (match) {
        const qty = parseInt(match[0], 10);
        if (qty > 0 && qty <= 500) {
          return basePrice * qty;
        }
      }
    }
    return basePrice;
  };

  // Security validation to ensure user doesn't accidentally paste a 12-to-16-digit card number
  const containsCardNumberPattern = (text) => {
    if (!text) return false;
    const digitsOnly = text.replace(/[\s-]/g, '');
    return /\d{12,19}/.test(digitsOnly);
  };

  // Handle Step 1 Form Submission
  const handleSubmitServiceRequest = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formState.customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    const cleanMobile = formState.mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (
      containsCardNumberPattern(formState.description) ||
      containsCardNumberPattern(formState.amountOrQty)
    ) {
      setFormError(
        'SECURITY ALERT: Please do NOT enter any 12-to-16 digit card or Aadhaar numbers in the text fields.'
      );
      return;
    }

    if (activeServiceForForm.isCreditCard) {
      if (
        !formState.safeCallbackOnly &&
        formState.lastFourDigits &&
        !/^\d{4}$/.test(formState.lastFourDigits.trim())
      ) {
        setFormError('If provided, last 4 digits of the card must be exactly 4 numbers.');
        return;
      }
      if (!formState.ccSecurityConsent) {
        setFormError(
          'Please confirm the Credit Card Security Acknowledgment (no CVV, PIN, or OTP shared).'
        );
        return;
      }
    }

    if (!formState.consentPrivacy) {
      setFormError('Please accept the Privacy Policy and Terms of Service to proceed.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newRequest = {
      id: `BSC-2026-${randomNum}`,
      customerName: formState.customerName.trim(),
      mobile: cleanMobile,
      serviceId: activeServiceForForm.id,
      serviceName: activeServiceForForm.name,
      isCreditCard: Boolean(activeServiceForForm.isCreditCard),
      contactMethod: activeServiceForForm.isCreditCard ? formState.contactMethod : 'WhatsApp / Call',
      ccServiceType: activeServiceForForm.isCreditCard ? formState.ccServiceType : '',
      bankIssuer:
        activeServiceForForm.isCreditCard && !formState.safeCallbackOnly
          ? formState.bankIssuer.trim() || 'Not Specified'
          : 'Callback Only',
      lastFourDigits:
        activeServiceForForm.isCreditCard && !formState.safeCallbackOnly
          ? formState.lastFourDigits.trim() || 'N/A'
          : 'N/A',
      safeCallbackOnly: activeServiceForForm.isCreditCard ? formState.safeCallbackOnly : false,
      description:
        formState.description.trim() ||
        (formState.safeCallbackOnly
          ? 'Customer requested a safe callback from the shop desk.'
          : `Online request for ${activeServiceForForm.name}`),
      amountOrQty: formState.safeCallbackOnly
        ? 'Discuss on Callback'
        : formState.amountOrQty.trim() || 'Standard 1 Unit',
      preferredDateTime: formState.preferredDateTime.trim() || 'Today during shop hours',
      uploadedFileName: activeServiceForForm.isCreditCard
        ? 'Card Uploads Disabled for Security'
        : formState.uploadedFileName || 'No file attached',
      status: 'Pending',
      createdAt: nowStr,
      adminNote: formState.safeCallbackOnly
        ? 'Safe Callback requested by customer. Our shop desk will call you shortly.'
        : 'Request received online. You can visit the shop or message us on WhatsApp.',
      paymentStatus: activeServiceForForm.isCreditCard
        ? 'Gateway Excluded (CC Policy)'
        : 'Pending Payment',
      paymentMethod: activeServiceForForm.isCreditCard
        ? 'Direct Authorized Portal / Desk'
        : 'Unselected',
      transactionRef: 'N/A',
      gatewayFeePaid: 0
    };

    if (!activeServiceForForm.isCreditCard && gatewayConfig.enableOnlineGateway) {
      setPendingRequestData(newRequest);
      setGatewayStep(true);
      return;
    }

    try {
      const savedRequest = await saveRequest(newRequest);
      setSubmittedRequestReceipt(savedRequest);
    } catch (error) {
      setFormError(`Could not save your request: ${error.message}`);
    }
  };

  // Complete Payment Gateway Checkout (For Standard Non-Credit-Card Services)
  const handleCompleteGatewayPayment = async (e) => {
    if (e) e.preventDefault();
    if (!pendingRequestData || !activeServiceForForm) return;
    setGatewayError('');

    const payableAmount = calculatePayableFee(
      activeServiceForForm,
      pendingRequestData.amountOrQty
    );

    if (paymentChoice === 'upi_id' && !upiIdInput.includes('@')) {
      setGatewayError('Please enter a valid UPI ID (e.g., mobile@ybl or name@oksbi).');
      return;
    }

    setGatewayProcessing(true);

    setTimeout(() => {
      const randomTxn = `TXN${Math.floor(100000000 + Math.random() * 900000000)}`;
      const isPayAtCounter = paymentChoice === 'pay_at_shop';

      const methodLabels = {
        upi_qr: 'UPI QR Scan (GPay / PhonePe / Paytm)',
        upi_id: `UPI Collect (${upiIdInput.trim()})`,
        razorpay_card_net: 'Standard Checkout (NetBanking / Debit)',
        pay_at_shop: 'Pay at Shop Counter'
      };

      const finalizedRequest = {
        ...pendingRequestData,
        paymentStatus: isPayAtCounter
          ? `Pay at Counter (₹${payableAmount})`
          : `Payment submitted – verification pending (₹${payableAmount})`,
        paymentMethod: methodLabels[paymentChoice] || 'Online Gateway',
        transactionRef: isPayAtCounter ? 'PAY-AT-SHOP' : (utrInput.trim() ? `UTR-${utrInput.trim()}` : 'PENDING-VERIFICATION'),
        gatewayFeePaid: 0,
        adminNote: isPayAtCounter
          ? `Customer opted to pay ₹${payableAmount} at shop counter upon pickup/visit.`
          : `Payment details submitted via ${methodLabels[paymentChoice]}; shop staff must verify receipt before marking payment complete.`
      };

      saveRequest(finalizedRequest).then((saved) => {
        setGatewayProcessing(false);
        setGatewayStep(false);
        setSubmittedRequestReceipt(saved);
        setPendingRequestData(null);
      }).catch((error) => {
        setGatewayProcessing(false);
        setGatewayError(`Could not save request: ${error.message}`);
      });
    }, 800);
  };

  // Copy Request ID helper
  const handleCopyId = (idText) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(idText);
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Handle Request Tracking Search
  const handleSearchRequest = async (e) => {
    if (e) e.preventDefault();
    setTrackError('');
    const query = trackInput.trim().toUpperCase();
    if (!query) {
      setTrackError('Please enter your Request ID (for example, BSC-2026-A1B2C3).');
      return;
    }

    try {
      const found = await apiRequest(`/track/${encodeURIComponent(query)}`, { method: 'GET' });
      setTrackedResult(found.request);
    } catch {
      setTrackedResult(null);
      setTrackError('No matching request found. Please check your Request ID.');
    }
  };

  // Handle Admin Password Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await apiRequest('/admin/login', { method: 'POST', body: JSON.stringify({ password: loginInputPwd }) });
      localStorage.setItem('bsc_admin_token', data.token);
      setIsAdminUnlocked(true);
      setLoginInputPwd('');
      await refreshRequests();
    } catch (error) {
      setLoginError(error.message || 'Incorrect Admin Password. Please try again.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminUnlocked(false);
    localStorage.removeItem('bsc_admin_token');
    setLoginInputPwd('');
  };

  // Admin Update Request Status
  const handleUpdateRequestStatus = async (reqId, newStatus) => {
    try {
      const data = await apiRequest(`/requests/${encodeURIComponent(reqId)}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      setRequests((prev) => prev.map((r) => (r.id === reqId ? data.request : r)));
      if (trackedResult && trackedResult.id === reqId) setTrackedResult(data.request);
    } catch (error) { alert(`Could not update request: ${error.message}`); }
  };

  // Admin Save or Add Service
  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    if (editingServiceId) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingServiceId
            ? {
                ...s,
                name: serviceForm.name.trim(),
                category: serviceForm.category.trim(),
                price: Number(serviceForm.price) || 0,
                priceUnit: serviceForm.priceUnit.trim(),
                description: serviceForm.description.trim(),
                requiresDoc: Boolean(serviceForm.requiresDoc),
                isCreditCard: Boolean(serviceForm.isCreditCard)
              }
            : s
        )
      );
      setEditingServiceId(null);
    } else {
      const newSrv = {
        id: `srv-custom-${Date.now()}`,
        name: serviceForm.name.trim(),
        category: serviceForm.category.trim() || 'Custom Service',
        price: Number(serviceForm.price) || 0,
        priceUnit: serviceForm.priceUnit.trim() || 'per service',
        quantityType: 'quantity',
        iconName: serviceForm.isCreditCard ? 'CreditCard' : 'Sparkles',
        requiresDoc: Boolean(serviceForm.requiresDoc),
        isCreditCard: Boolean(serviceForm.isCreditCard),
        description:
          serviceForm.description.trim() ||
          'Professional assistance available at Balaji Stationery and Communications.',
        checklist: ['Relevant document or reference details']
      };
      setServices((prev) => [...prev, newSrv]);
    }

    setServiceForm({
      name: '',
      category: 'Stationery & Online',
      price: 50,
      priceUnit: 'per service',
      description: '',
      requiresDoc: true,
      isCreditCard: false
    });
  };

  const handleStartEditService = (srv) => {
    setEditingServiceId(srv.id);
    setServiceForm({
      name: srv.name,
      category: srv.category,
      price: srv.price,
      priceUnit: srv.priceUnit,
      description: srv.description,
      requiresDoc: srv.requiresDoc,
      isCreditCard: srv.isCreditCard
    });
  };

  const handleDeleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Handle Admin Password Update
  const handleUpdateAdminPassword = async (e) => {
    e.preventDefault();
    if (newPwdInput.trim().length < 12) {
      setPwdChangeMessage('Password must be at least 12 characters long.');
      return;
    }
    if (newPwdInput !== confirmPwdInput) {
      setPwdChangeMessage('New password and confirmation do not match.');
      return;
    }
    try {
      await apiRequest('/admin/password', { method: 'POST', body: JSON.stringify({ newPassword: newPwdInput.trim() }) });
    } catch (error) {
      setPwdChangeMessage(error.message);
      return;
    }
    setNewPwdInput('');
    setConfirmPwdInput('');
    setPwdChangeMessage('Admin password updated successfully!');
    setTimeout(() => setPwdChangeMessage(''), 3000);
  };

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.pageBg} text-slate-900 bsc-body-font`}>
      {apiError && <div role="alert" className="bg-amber-100 text-amber-900 px-4 py-2 text-sm text-center">Website database is not reachable yet: {apiError}. Please contact the shop.</div>}
      {/* ==========================================
          CLEAN, FAMILIAR TYPOGRAPHY & SPACING
      ========================================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .bsc-body-font, h1, h2, h3, h4, .bsc-heading-font, .font-mono, .bsc-price-font {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          letter-spacing: normal;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

      {/* ==========================================
          TOP LOCATION & HOURS BAR
      ========================================== */}
      <div className={`${currentTheme.topBar} text-xs sm:text-sm py-2.5 px-4 sm:px-8 border-b`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-white">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Goutham Nagar Colony, Patancheru, Telangana - 502319</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <span className="hidden md:inline-flex items-center gap-2 text-blue-100">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              {SHOP_INFO.hours}
            </span>
            <a
              href={`tel:${SHOP_INFO.phoneClean}`}
              className="font-medium text-amber-300 hover:underline flex items-center gap-2"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>Call: {SHOP_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ==========================================
          MAIN NAVIGATION HEADER
      ========================================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] border border-amber-400 flex flex-col items-center justify-center text-white shrink-0 shadow-sm">
              <span className="font-semibold text-xs text-amber-300 leading-none">
                {customLogoText}
              </span>
              <span className="text-[10px] text-white mt-0.5">502319</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-[#1E3A8A] leading-tight">
                BALAJI STATIONERY &amp; COMMUNICATIONS
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                {SHOP_INFO.tagline}
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'home'
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'services'
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                activeTab === 'track'
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Track Request</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 border transition-colors ${
                activeTab === 'admin'
                  ? 'bg-amber-400 text-slate-900 border-amber-500 font-semibold shadow-sm'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Shop Admin</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ==========================================
          MAIN PAGE CONTENT
      ========================================== */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <section className="bg-[#1E3A8A] text-white py-12 sm:py-16 px-4 sm:px-8 border-b-4 border-amber-400">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 bg-blue-900/80 border border-amber-300/40 text-amber-300 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>Goutham Nagar Colony, Patancheru – 502319</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-white">
                    BALAJI STATIONERY AND COMMUNICATIONS
                  </h2>

                  <p className="text-base sm:text-lg text-amber-300 font-medium">
                    &ldquo;{SHOP_INFO.tagline}&rdquo;
                  </p>

                  <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
                    Select any service below to send your request online, check required document checklists,
                    or contact our shop directly on WhatsApp or phone.
                  </p>

                  <div className="flex flex-wrap items-center gap-3.5 pt-3">
                    <button
                      onClick={() => handleOpenServiceForm(services[0])}
                      className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-6 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all"
                    >
                      <span>Request a Service</span>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>

                    <button
                      onClick={() => setActiveTab('services')}
                      className="bg-white hover:bg-slate-100 text-[#1E3A8A] font-semibold px-6 py-3.5 rounded-xl text-sm sm:text-base shadow-sm transition-all"
                    >
                      View All Services
                    </button>

                    <a
                      href={`https://wa.me/${SHOP_INFO.phoneClean}?text=${encodeURIComponent(
                        'Namaste Balaji Stationery and Communications! I would like to inquire about a service.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>WhatsApp Us</span>
                    </a>

                    <a
                      href={`tel:${SHOP_INFO.phoneClean}`}
                      className="bg-blue-800 hover:bg-blue-700 border border-blue-400 text-white font-semibold px-6 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-2 transition-all"
                    >
                      <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-200 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-semibold text-[#1E3A8A] block uppercase tracking-wider">
                          Quick Selection
                        </span>
                        <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
                          Most Used Shop Services
                        </h3>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-medium px-3 py-1 rounded-lg">
                        Open Today
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {services.slice(0, 6).map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => handleOpenServiceForm(srv)}
                          className="p-3.5 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:bg-blue-50/50 text-left flex items-center gap-3 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-amber-300 flex items-center justify-center shrink-0 shadow-sm border border-amber-400/50">
                            {renderServiceIcon(srv.iconName, 'w-5 h-5')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                              {srv.name}
                            </p>
                            <p className="text-xs font-semibold text-[#1E3A8A] mt-0.5">
                              ₹{srv.price}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-800 flex items-start gap-3 leading-relaxed">
                      <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>Safe & Easy:</strong> Pay securely by UPI QR or choose pay-at-shop counter. Credit card inquiries include safe callback support.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto py-14 px-4 sm:px-8 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider">
                  Simple 3-Step Process
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                  How to Use Our Shop Services Online
                </h3>
                <p className="text-sm text-slate-600">
                  Designed for convenience and ease of use for all our customers in Patancheru.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] text-amber-300 border border-amber-400 flex items-center justify-center font-semibold text-lg shadow-sm">
                    1
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">Select Service & Fill Form</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Choose from our list of 10 core services, review required documents, enter your details, and submit online.
                  </p>
                </div>

                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] text-amber-300 border border-amber-400 flex items-center justify-center font-semibold text-lg shadow-sm">
                    2
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">Secure Payment or Pay at Shop</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Pay instantly via UPI QR / GPay / PhonePe or select &ldquo;Pay at Shop Counter&rdquo; when visiting our Goutham Nagar location.
                  </p>
                </div>

                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] text-amber-300 border border-amber-400 flex items-center justify-center font-semibold text-lg shadow-sm">
                    3
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">Get Unique ID & Track Status</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Receive your Request ID (e.g., BSC-2026-4810), send your receipt directly on WhatsApp, and track progress in real time.
                  </p>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto py-10 px-4 sm:px-8 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs sm:text-sm font-medium text-[#1E3A8A]">
                    Clear Rates in Indian Rupees (₹)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                    Featured Shop Services (Click to Start)
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('services')}
                  className="text-sm font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1"
                >
                  <span>Open Full Services Page</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-[#1E3A8A] shadow-sm flex flex-col justify-between overflow-hidden transition-all"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A] text-amber-300 border-2 border-amber-400 flex items-center justify-center shadow-md shrink-0">
                          {renderServiceIcon(service.iconName, 'w-6 h-6')}
                        </div>
                        <div className="text-right bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                          <span className="text-[11px] text-slate-500 block">Rate</span>
                          <span className="text-xl font-semibold text-[#1E3A8A]">
                            ₹{service.price}
                          </span>
                          <span className="text-[11px] text-slate-600 block mt-0.5">
                            {service.priceUnit}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="inline-block text-xs font-medium text-[#1E3A8A] bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                          {service.category}
                        </span>
                        <h3 className="text-lg font-semibold text-slate-900 mt-2.5">
                          {service.name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {service.checklist && service.checklist.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[11px] font-semibold text-slate-700 block uppercase tracking-wide">
                            What to bring / prepare:
                          </span>
                          <ul className="list-disc pl-4 text-xs text-slate-600 space-y-0.5">
                            {service.checklist.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {service.isCreditCard ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            Safe Callback / Inquiry Only
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-lg">
                            <QrCode className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            UPI QR / Shop Payment Available
                          </span>
                        )}
                        {service.requiresDoc && !service.isCreditCard && (
                          <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg">
                            <Upload className="w-3.5 h-3.5 shrink-0" />
                            Document Upload Supported
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                      <button
                        onClick={() => handleOpenServiceForm(service)}
                        className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <span>
                          {service.isCreditCard
                            ? 'Open Credit Card Inquiry Form'
                            : 'Select This Service'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-amber-300 shrink-0" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border-t border-slate-200 py-12 px-4 sm:px-8 mt-10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 bg-[#1E3A8A] text-white rounded-2xl p-7 border-2 border-amber-400 space-y-5 shadow-sm">
                  <span className="text-xs font-medium uppercase tracking-wider text-amber-300 block">
                    Shop Address & Timings
                  </span>
                  <h3 className="text-xl font-semibold">
                    Goutham Nagar Colony, Patancheru
                  </h3>

                  <div className="space-y-4 text-sm text-blue-100">
                    <div className="flex items-start gap-3.5">
                      <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{SHOP_INFO.address}</span>
                    </div>
                    <div className="flex items-start gap-3.5">
                      <Clock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{SHOP_INFO.hours}</span>
                    </div>
                    <div className="flex items-center gap-3.5">
                      <Phone className="w-5 h-5 text-amber-300 shrink-0" />
                      <span className="font-semibold">{SHOP_INFO.phoneDisplay}</span>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/${SHOP_INFO.phoneClean}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>WhatsApp Shop</span>
                    </a>
                    <a
                      href={`tel:${SHOP_INFO.phoneClean}`}
                      className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 transition-colors"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>Call Shop</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-[#1E3A8A] block">
                      Customer Feedback (Patancheru - 502319)
                    </span>
                    <h3 className="text-2xl font-semibold text-slate-900 mt-1">
                      Trusted by Our Local Community
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {TESTIMONIALS.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 shrink-0" />
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            &ldquo;{item.comment}&rdquo;
                          </p>
                        </div>
                        <div className="pt-3 border-t border-slate-200">
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.locality}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8 space-y-8">
            <div className="bg-[#1E3A8A] text-white p-7 rounded-2xl border-b-4 border-amber-400 flex flex-wrap items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-amber-300 block">
                  Service List & Rates • PIN 502319
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold">
                  All Stationery, Banking & Online Services
                </h2>
                <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                  Click on any service below to open the simple request form and submit details online.
                </p>
              </div>
              <a
                href={`https://wa.me/${SHOP_INFO.phoneClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 shrink-0 transition-colors"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#1E3A8A] transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A] text-amber-300 border-2 border-amber-400 flex items-center justify-center shadow-md shrink-0">
                        {renderServiceIcon(service.iconName, 'w-6 h-6')}
                      </div>
                      <div className="text-right bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                        <span className="text-2xl font-semibold text-[#1E3A8A]">
                          ₹{service.price}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {service.priceUnit}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="inline-block text-xs font-medium text-[#1E3A8A] bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg mb-2">
                        {service.category}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {service.checklist && service.checklist.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[11px] font-semibold text-slate-700 block uppercase tracking-wide">
                          Document Checklist:
                        </span>
                        <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                          {service.checklist.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {service.isCreditCard ? (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          <strong>Payment Gateway Excluded:</strong> Credit card requests do not use online checkout. No card numbers, CVV, or PIN collected.
                        </span>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2.5">
                        <QrCode className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="leading-relaxed">
                          <strong>Online Gateway Attached:</strong> Pay ₹{service.price} via UPI QR / GPay or choose Pay at Shop.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 bg-slate-50 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenServiceForm(service)}
                      className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>
                        {service.isCreditCard
                          ? 'Open Credit Card Inquiry Form'
                          : 'Select & Proceed to Form'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-amber-300 shrink-0" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="max-w-4xl mx-auto py-12 px-4 sm:px-8 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A] block">
                  Real-Time Request & Payment Status
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                  Track Your Service Request
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter the Request ID shown on your confirmation receipt.
                </p>
              </div>

              <form onSubmit={handleSearchRequest} className="flex flex-col sm:flex-row gap-3.5">
                <input
                  type="text"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  placeholder="Enter Request ID (BSC-2026-A1B2C3)"
                  className="flex-1 px-4 py-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
                <button
                  type="submit"
                  className="bg-[#1E3A8A] hover:bg-blue-800 text-white font-semibold px-7 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Search className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Check Status</span>
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2.5 text-xs pt-1">
                <span className="text-slate-500 font-medium">Sample IDs to test:</span>
                {requests.slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setTrackInput(r.id);
                      setTrackedResult(r);
                      setTrackError('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1E3A8A] font-mono font-semibold hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    {r.id}
                  </button>
                ))}
              </div>

              {trackError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {trackError}
                </div>
              )}

              {trackedResult && (
                <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-300 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
                    <div>
                      <span className="text-xs text-slate-500 block">Request ID</span>
                      <span className="text-xl sm:text-2xl font-mono font-semibold text-[#1E3A8A]">
                        {trackedResult.id}
                      </span>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold border ${getStatusBadge(
                        trackedResult.status
                      )}`}
                    >
                      {trackedResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">Service Requested</span>
                      <span className="font-semibold text-[#1E3A8A]">{trackedResult.serviceName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">Submitted On</span>
                      <span className="font-medium text-slate-700">{trackedResult.createdAt}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">Preferred Time</span>
                      <span className="font-medium text-slate-700">{trackedResult.preferredDateTime || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="text-xs font-semibold text-[#1E3A8A] block">
                      Shop Counter Note:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{trackedResult.adminNote}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
            {!isAdminUnlocked ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-[#1E3A8A] text-white p-7 border-b-4 border-amber-400 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center mx-auto shadow-sm">
                    <Lock className="w-6 h-6 shrink-0" />
                  </div>
                  <h2 className="text-xl font-semibold">Shop Admin Protected Login</h2>
                  <p className="text-xs text-blue-200 max-w-xs mx-auto">
                    Authorized access for Balaji Stationery and Communications owner
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="p-7 space-y-5">
                  {loginError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                      {loginError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Enter Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordText ? 'text' : 'password'}
                        value={loginInputPwd}
                        onChange={(e) => setLoginInputPwd(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordText(!showPasswordText)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                      >
                        {showPasswordText ? (
                          <EyeOff className="w-5 h-5 shrink-0" />
                        ) : (
                          <Eye className="w-5 h-5 shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-amber-300 font-semibold py-3.5 rounded-xl text-sm shadow-sm transition-colors"
                  >
                    Unlock Admin Dashboard
                  </button>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <span className="text-slate-600">
                      Admin access is secured by the server. Use the password configured by the shop owner.
                    </span>

                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#1E3A8A] text-white p-6 sm:p-7 flex flex-wrap items-center justify-between gap-5 border-b-4 border-amber-400">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block">
                      Owner Control Panel • Unlocked
                    </span>
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      Balaji Stationery Admin Dashboard
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-blue-900 p-1.5 rounded-2xl flex items-center gap-1.5 border border-blue-800">
                      <button
                        onClick={() => setAdminSubTab('requests')}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          adminSubTab === 'requests'
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-blue-100 hover:text-white'
                        }`}
                      >
                        Customer Requests ({requests.length})
                      </button>
                      <button
                        onClick={() => setAdminSubTab('services')}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          adminSubTab === 'services'
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-blue-100 hover:text-white'
                        }`}
                      >
                        Manage Services &amp; ₹ Prices
                      </button>
                      <button
                        onClick={() => setAdminSubTab('security')}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                          adminSubTab === 'security'
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-blue-100 hover:text-white'
                        }`}
                      >
                        <KeyRound className="w-4 h-4 shrink-0" />
                        <span>Gateway &amp; Security</span>
                      </button>
                    </div>

                    <button
                      onClick={handleAdminLogout}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>

                {adminSubTab === 'requests' && (
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                        <span className="text-xs font-semibold text-amber-800">Pending</span>
                        <p className="text-2xl font-semibold text-amber-950">
                          {requests.filter((r) => r.status === 'Pending').length}
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                        <span className="text-xs font-semibold text-blue-800">In Progress</span>
                        <p className="text-2xl font-semibold text-blue-950">
                          {requests.filter((r) => r.status === 'In Progress').length}
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                        <span className="text-xs font-semibold text-emerald-800">Completed</span>
                        <p className="text-2xl font-semibold text-emerald-950">
                          {requests.filter((r) => r.status === 'Ready / Completed').length}
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-xs font-semibold text-slate-600">Total Requests</span>
                        <p className="text-2xl font-semibold text-slate-900">
                          {requests.length}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {requests.map((req) => (
                        <div
                          key={req.id}
                          className="border border-slate-200 rounded-2xl p-6 hover:border-[#1E3A8A] transition-all bg-white shadow-sm space-y-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-mono font-semibold text-base text-[#1E3A8A] bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200">
                                {req.id}
                              </span>
                              <span
                                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border ${getStatusBadge(
                                  req.status
                                )}`}
                              >
                                {req.status}
                              </span>
                              {req.isCreditCard ? (
                                <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-300">
                                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Gateway Excluded (CC Inquiry)
                                </span>
                              ) : (
                                <span
                                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                                    req.paymentStatus?.includes('Paid Online')
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                                  {req.paymentStatus || 'Pay at Counter'}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">{req.createdAt}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-sm">
                            <div className="space-y-1">
                              <span className="text-xs text-slate-400 block">Customer</span>
                              <p className="font-semibold text-slate-900">{req.customerName}</p>
                              <a
                                href={`tel:${req.mobile}`}
                                className="text-xs font-semibold text-[#1E3A8A] hover:underline block"
                              >
                                +91 {req.mobile}
                              </a>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-slate-400 block">Service</span>
                              <p className="font-semibold text-[#1E3A8A]">{req.serviceName}</p>
                              <span className="text-xs text-slate-600 block">
                                Val/Qty: <strong>{req.amountOrQty}</strong>
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-slate-400 block">
                                Gateway / Payment Info
                              </span>
                              <p className="font-semibold text-slate-800 text-xs">
                                {req.paymentMethod || 'Pay at Shop Counter'}
                              </p>
                              <span className="text-[11px] font-mono text-slate-500 block truncate">
                                Ref: {req.transactionRef || 'N/A'} • Time: {req.preferredDateTime}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-slate-400 block">
                                Update Status
                              </label>
                              <select
                                value={req.status}
                                onChange={(e) =>
                                  handleUpdateRequestStatus(req.id, e.target.value)
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Ready / Completed">Ready / Completed</option>
                              </select>
                            </div>
                          </div>

                          <div className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                            <strong>Details:</strong> {req.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminSubTab === 'services' && (
                  <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <form
                      onSubmit={handleSaveService}
                      className="lg:col-span-5 bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-4 h-fit"
                    >
                      <h3 className="text-base font-semibold text-[#1E3A8A] flex items-center gap-2">
                        {editingServiceId ? (
                          <>
                            <Edit3 className="w-4 h-4 shrink-0" /> Edit Service &amp; Price
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 shrink-0" /> Add New Shop Service
                          </>
                        )}
                      </h3>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Service Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={serviceForm.name}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, name: e.target.value })
                          }
                          placeholder="e.g., Passport Size Photo Print"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Price in ₹ *
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={serviceForm.price}
                            onChange={(e) =>
                              setServiceForm({ ...serviceForm, price: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white font-semibold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Unit Label
                          </label>
                          <input
                            type="text"
                            value={serviceForm.priceUnit}
                            onChange={(e) =>
                              setServiceForm({ ...serviceForm, priceUnit: e.target.value })
                            }
                            placeholder="per page / application"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={serviceForm.description}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, description: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div className="space-y-2.5 pt-2">
                        <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={serviceForm.requiresDoc}
                            onChange={(e) =>
                              setServiceForm({ ...serviceForm, requiresDoc: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#1E3A8A]"
                          />
                          Allow Optional Document Upload
                        </label>
                        <label className="flex items-center gap-2.5 text-xs font-semibold text-amber-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={serviceForm.isCreditCard}
                            onChange={(e) =>
                              setServiceForm({ ...serviceForm, isCreditCard: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-amber-600"
                          />
                          Credit Card Service (Excludes Payment Gateway Automatically)
                        </label>
                      </div>

                      <div className="flex gap-3 pt-3">
                        <button
                          type="submit"
                          className="flex-1 bg-[#1E3A8A] hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors"
                        >
                          {editingServiceId ? 'Update Service' : 'Add Service'}
                        </button>
                        {editingServiceId && (
                          <button
                            type="button"
                            onClick={() => setEditingServiceId(null)}
                            className="px-4 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>

                    <div className="lg:col-span-7 space-y-4">
                      {services.map((srv) => (
                        <div
                          key={srv.id}
                          className="p-5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white shadow-sm"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="font-semibold text-slate-900 text-sm">{srv.name}</h4>
                              <span className="text-xs font-semibold text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                                ₹{srv.price} ({srv.priceUnit})
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{srv.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditService(srv)}
                              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-[#1E3A8A] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 shrink-0" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                              title="Remove Service"
                            >
                              <Trash2 className="w-4 h-4 shrink-0" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminSubTab === 'security' && (
                  <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="border border-blue-200 rounded-2xl p-6 sm:p-7 bg-blue-50/50 space-y-5">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <h3 className="text-base font-semibold text-[#1E3A8A] flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-[#1E3A8A] shrink-0" />
                          Payment Gateway Configuration
                        </h3>
                        <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                          CC Services Excluded
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Configure your shop UPI ID and payment gateway preferences for standard services. Credit card services never trigger the online gateway.
                      </p>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Shop Merchant UPI ID (for QR &amp; Collect)
                          </label>
                          <input
                            type="text"
                            value={gatewayConfig.merchantUpiId}
                            onChange={(e) =>
                              setGatewayConfig({
                                ...gatewayConfig,
                                merchantUpiId: e.target.value
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm font-mono font-semibold bg-white"
                            placeholder="e.g., 9966272437@ybl"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Gateway Display Provider Name
                          </label>
                          <input
                            type="text"
                            value={gatewayConfig.gatewayProvider}
                            onChange={(e) =>
                              setGatewayConfig({
                                ...gatewayConfig,
                                gatewayProvider: e.target.value
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-blue-300 text-sm bg-white"
                            placeholder="Razorpay / BharatPe UPI Gateway"
                          />
                        </div>

                        <div className="space-y-2.5 pt-1">
                          <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={gatewayConfig.enableOnlineGateway}
                              onChange={(e) =>
                                setGatewayConfig({
                                  ...gatewayConfig,
                                  enableOnlineGateway: e.target.checked
                                })
                              }
                              className="w-4 h-4 rounded text-[#1E3A8A]"
                            />
                            Enable Online Payment Gateway Step
                          </label>

                          <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={gatewayConfig.allowPayAtCounter}
                              onChange={(e) =>
                                setGatewayConfig({
                                  ...gatewayConfig,
                                  allowPayAtCounter: e.target.checked
                                })
                              }
                              className="w-4 h-4 rounded text-[#1E3A8A]"
                            />
                            Also Allow &ldquo;Pay at Shop Counter&rdquo; Option
                          </label>
                        </div>

                        <div className="pt-2 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setGatewaySaveMsg('Gateway settings saved!');
                              setTimeout(() => setGatewaySaveMsg(''), 2500);
                            }}
                            className="bg-[#1E3A8A] hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors"
                          >
                            Save Gateway Settings
                          </button>
                          {gatewaySaveMsg && (
                            <span className="text-xs font-semibold text-emerald-700">
                              ✓ {gatewaySaveMsg}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <form
                        onSubmit={handleUpdateAdminPassword}
                        className="border border-slate-200 rounded-2xl p-6 sm:p-7 bg-white space-y-4 shadow-sm"
                      >
                        <h3 className="text-base font-semibold text-[#1E3A8A]">
                          Change Admin Login Password
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <input
                            type="password"
                            value={newPwdInput}
                            onChange={(e) => setNewPwdInput(e.target.value)}
                            placeholder="New Password"
                            className="px-4 py-3 rounded-xl border border-slate-300 text-sm"
                          />
                          <input
                            type="password"
                            value={confirmPwdInput}
                            onChange={(e) => setConfirmPwdInput(e.target.value)}
                            placeholder="Confirm New Password"
                            className="px-4 py-3 rounded-xl border border-slate-300 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors"
                          >
                            Update Password
                          </button>
                          {pwdChangeMessage && (
                            <span className="text-xs font-semibold text-[#1E3A8A]">
                              {pwdChangeMessage}
                            </span>
                          )}
                        </div>
                      </form>

                      <div className="border border-slate-200 rounded-2xl p-6 sm:p-7 bg-white space-y-4 shadow-sm">
                        <h3 className="text-base font-semibold text-[#1E3A8A]">
                          Customize Header Business Logo Emblem
                        </h3>
                        <div className="flex items-center gap-4">
                          <input
                            type="text"
                            maxLength={4}
                            value={customLogoText}
                            onChange={(e) => setCustomLogoText(e.target.value.toUpperCase())}
                            className="w-32 px-4 py-3 rounded-xl border border-slate-300 font-semibold text-base text-center uppercase bg-slate-50"
                            placeholder="BSC"
                          />
                          <button
                            type="button"
                            onClick={handleAdminLogout}
                            className="ml-auto bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition-colors"
                          >
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span>Lock &amp; Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {activeServiceForForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-300 overflow-hidden my-8">
            <div className="bg-[#1E3A8A] text-white p-6 sm:p-7 flex items-start justify-between gap-4 border-b-4 border-amber-400">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 border-2 border-amber-500 flex items-center justify-center shadow-md shrink-0">
                  {renderServiceIcon(activeServiceForForm.iconName, 'w-6 h-6')}
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block">
                    {activeServiceForForm.isCreditCard
                      ? 'Secure Credit Card Assistance Form (No Gateway)'
                      : gatewayStep
                      ? 'Step 2 of 2 • Official Payment Gateway Checkout'
                      : 'Step 1 of 2 • Service Request & Gateway Checkout'}
                  </span>
                  <h3 className="text-xl font-semibold leading-tight">{activeServiceForForm.name}</h3>
                  <p className="text-xs text-blue-200">
                    Standard Rate: ₹{activeServiceForForm.price} ({activeServiceForForm.priceUnit})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveServiceForForm(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            {submittedRequestReceipt ? (
              <div className="p-6 sm:p-10 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 shrink-0" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block">
                    Request Submitted Successfully
                  </span>
                  <h4 className="text-2xl font-semibold text-slate-900">
                    Thank You, {submittedRequestReceipt.customerName}!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Your request has been registered with Balaji Stationery and Communications, Patancheru. Please save your Unique Request ID below:
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 max-w-sm mx-auto space-y-2">
                  <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                    YOUR UNIQUE REQUEST ID
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono font-semibold text-[#1E3A8A]">
                      {submittedRequestReceipt.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(submittedRequestReceipt.id)}
                      className="text-xs font-semibold bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-[#1E3A8A] hover:bg-blue-100 flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 shrink-0" />
                      {copiedId ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="text-left bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <p>
                    <strong>Service:</strong> {submittedRequestReceipt.serviceName}
                  </p>
                  <p>
                    <strong>Request Status:</strong>{' '}
                    <span className="font-semibold text-amber-700">
                      {submittedRequestReceipt.status}
                    </span>
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{' '}
                    <span className="font-semibold text-emerald-700">
                      {submittedRequestReceipt.paymentStatus}
                    </span>
                  </p>
                  {!submittedRequestReceipt.isCreditCard && (
                    <p>
                      <strong>Payment Mode / Ref:</strong> {submittedRequestReceipt.paymentMethod} (
                      <span className="font-mono">{submittedRequestReceipt.transactionRef}</span>)
                    </p>
                  )}
                  <p>
                    <strong>Preferred Time:</strong> {submittedRequestReceipt.preferredDateTime}
                  </p>
                  {submittedRequestReceipt.isCreditCard && (
                    <p className="text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium mt-2 leading-relaxed">
                      ✓ Credit Card Compliance: Online payment gateway is disabled for credit card services. Our desk will guide you via phone call or official BBPS portal.
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <a
                    href={`https://wa.me/${SHOP_INFO.phoneClean}?text=${encodeURIComponent(
                      `Namaste Balaji Stationery! I have submitted an online request.\nRequest ID: *${submittedRequestReceipt.id}*\nService: *${submittedRequestReceipt.serviceName}*\nPayment: *${submittedRequestReceipt.paymentStatus}*\nRef: ${submittedRequestReceipt.transactionRef}\nName: ${submittedRequestReceipt.customerName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Send Receipt on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackInput(submittedRequestReceipt.id);
                      setTrackedResult(submittedRequestReceipt);
                      setActiveServiceForForm(null);
                      setActiveTab('track');
                    }}
                    className="flex-1 bg-[#1E3A8A] hover:bg-blue-800 text-white font-semibold py-3.5 px-5 rounded-xl text-xs sm:text-sm transition-colors"
                  >
                    Track Request Status
                  </button>
                </div>
              </div>
            ) : gatewayStep && pendingRequestData && !activeServiceForForm.isCreditCard ? (
              <form
                onSubmit={handleCompleteGatewayPayment}
                className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block">
                      {gatewayConfig.gatewayProvider} • Verified Merchant
                    </span>
                    <h4 className="text-base font-semibold">
                      {gatewayConfig.merchantName}
                    </h4>
                    <p className="text-xs text-slate-300">
                      Customer: {pendingRequestData.customerName} (+91 {pendingRequestData.mobile})
                    </p>
                  </div>
                  <div className="text-right bg-white/10 px-4 py-2.5 rounded-xl border border-white/15">
                    <span className="text-[11px] text-slate-300 block">Payable Fee</span>
                    <span className="text-2xl font-semibold text-amber-400">
                      ₹{calculatePayableFee(activeServiceForForm, pendingRequestData.amountOrQty)}
                    </span>
                  </div>
                </div>

                {gatewayError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{gatewayError}</span>
                  </div>
                )}

                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Select Payment Gateway Option
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentChoice('upi_qr')}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
                        paymentChoice === 'upi_qr'
                          ? 'border-2 border-[#1E3A8A] bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-[#1E3A8A] text-amber-300 shrink-0">
                        <QrCode className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          UPI QR Code (Instant)
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">GPay, PhonePe, Paytm</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentChoice('upi_id')}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
                        paymentChoice === 'upi_id'
                          ? 'border-2 border-[#1E3A8A] bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-emerald-700 text-white shrink-0">
                        <Smartphone className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Enter UPI ID / VPA</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Approve request on phone</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentChoice('razorpay_card_net')}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
                        paymentChoice === 'razorpay_card_net'
                          ? 'border-2 border-[#1E3A8A] bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-indigo-900 text-white shrink-0">
                        <Landmark className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          NetBanking / Cards
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">All Indian Banks</p>
                      </div>
                    </button>

                    {gatewayConfig.allowPayAtCounter && (
                      <button
                        type="button"
                        onClick={() => setPaymentChoice('pay_at_shop')}
                        className={`p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
                          paymentChoice === 'pay_at_shop'
                            ? 'border-2 border-amber-500 bg-amber-50/70 shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 shrink-0">
                          <Wallet className="w-5 h-5 shrink-0" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            Pay at Shop Counter
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Pay Cash/UPI at shop
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {paymentChoice === 'upi_qr' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl border-2 border-[#1E3A8A] shadow-sm flex flex-col items-center shrink-0">
                      <div className="w-36 h-36 bg-slate-900 rounded-xl p-2.5 flex flex-col items-center justify-center relative overflow-hidden">
                        <QrCode className="w-24 h-24 text-white shrink-0" />
                        <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                          SCAN &amp; PAY ₹
                          {calculatePayableFee(activeServiceForForm, pendingRequestData.amountOrQty)}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-[#1E3A8A] mt-2">
                        UPI: {gatewayConfig.merchantUpiId}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm flex-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                        <ShieldCheck className="w-4 h-4 shrink-0" /> 100% Zero-Fee UPI Gateway
                      </div>
                      <h5 className="font-semibold text-slate-900">
                        Scan with any UPI App (PhonePe, GPay, Paytm)
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Scan the QR or pay to Merchant UPI ID <strong className="text-[#1E3A8A] font-mono">{gatewayConfig.merchantUpiId}</strong>. Optionally enter your UPI UTR / Reference number below:
                      </p>
                      <input
                        type="text"
                        maxLength={12}
                        value={utrInput}
                        onChange={(e) => setUtrInput(e.target.value)}
                        placeholder="Optional: Enter 12-digit UTR / Ref No."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                      />
                    </div>
                  </div>
                )}

                {paymentChoice === 'upi_id' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Enter Your UPI ID / VPA *
                    </label>
                    <input
                      type="text"
                      required
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="e.g., 9848012345@ybl or name@okicici"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                    <p className="text-xs text-slate-500">
                      A payment request for <strong>₹{calculatePayableFee(activeServiceForForm, pendingRequestData.amountOrQty)}</strong> will be sent to your UPI app.
                    </p>
                  </div>
                )}

                {paymentChoice === 'razorpay_card_net' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 text-xs text-slate-700 leading-relaxed">
                    <div className="flex items-center gap-2 font-semibold text-[#1E3A8A] text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      Authorized Standard Redirect Checkout
                    </div>
                    <p>
                      Proceeding will record your online payment of <strong>₹{calculatePayableFee(activeServiceForForm, pendingRequestData.amountOrQty)}</strong> via our authorized merchant gateway.
                    </p>
                  </div>
                )}

                {paymentChoice === 'pay_at_shop' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1 leading-relaxed">
                    <p className="font-semibold">Pay Directly at Balaji Stationery Counter:</p>
                    <p>
                      Your request ID will be generated immediately. You can pay <strong>₹{calculatePayableFee(activeServiceForForm, pendingRequestData.amountOrQty)}</strong> by Cash or Shop QR when you visit our Goutham Nagar Colony counter.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setGatewayStep(false)}
                    className="px-5 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    ← Back to Form
                  </button>

                  <button
                    type="submit"
                    disabled={gatewayProcessing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 disabled:opacity-60 transition-colors"
                  >
                    {gatewayProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                        <span>Verifying Gateway...</span>
                      </>
                    ) : paymentChoice === 'pay_at_shop' ? (
                      <>
                        <Check className="w-4 h-4 shrink-0" />
                        <span>
                          Confirm Request (Pay at Shop)
                        </span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>
                          Complete Payment &amp; Generate ID
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleSubmitServiceRequest}
                className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Selected Service
                  </label>
                  <select
                    value={activeServiceForForm.id}
                    onChange={(e) => {
                      const found = services.find((s) => s.id === e.target.value);
                      if (found) handleOpenServiceForm(found);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-[#1E3A8A] bg-slate-50"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — ₹{s.price} ({s.priceUnit})
                      </option>
                    ))}
                  </select>
                </div>

                {activeServiceForForm.isCreditCard && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-950 space-y-1.5 leading-relaxed">
                        <p className="font-semibold uppercase tracking-wide text-amber-900">
                          Mandatory Credit Card Safety Notice:
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>
                            <strong>NEVER</strong> enter full card numbers, CVV, ATM PIN, OTP, or net banking passwords.
                          </li>
                          <li>
                            <strong>Photo uploads of payment cards are strictly disabled.</strong>
                          </li>
                          <li>
                            Online payment gateway is disabled for credit card services. We only assist through official BBPS bill desk or callback guidance.
                          </li>
                        </ul>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-amber-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.safeCallbackOnly}
                        onChange={(e) =>
                          setFormState({ ...formState, safeCallbackOnly: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#1E3A8A]"
                      />
                      <span className="text-xs font-semibold text-[#1E3A8A]">
                        Request a Safe Phone Callback Only (Skip financial &amp; card issuer fields)
                      </span>
                    </label>
                  </div>
                )}

                {activeServiceForForm.checklist && activeServiceForForm.checklist.length > 0 && (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
                    <span className="text-xs font-semibold text-[#1E3A8A] block uppercase tracking-wide">
                      📋 Checklist for {activeServiceForForm.name}:
                    </span>
                    <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                      {activeServiceForForm.checklist.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.customerName}
                      onChange={(e) =>
                        setFormState({ ...formState, customerName: e.target.value })
                      }
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formState.mobile}
                      onChange={(e) => setFormState({ ...formState, mobile: e.target.value })}
                      placeholder="e.g., 9848012345"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                {activeServiceForForm.isCreditCard && (
                  <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Preferred Contact Method
                        </label>
                        <select
                          value={formState.contactMethod}
                          onChange={(e) =>
                            setFormState({ ...formState, contactMethod: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                        >
                          <option value="Phone Call">Phone Call</option>
                          <option value="WhatsApp Message">WhatsApp Message</option>
                          <option value="Visit Shop Counter">Visit Shop Counter in Person</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Permitted Assistance Type
                        </label>
                        <select
                          value={formState.ccServiceType}
                          onChange={(e) =>
                            setFormState({ ...formState, ccServiceType: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                        >
                          <option value="Credit Card Bill Payment Assistance (BBPS)">
                            Credit Card Bill Payment Assistance (BBPS)
                          </option>
                          <option value="Statement Download / Portal Guidance">
                            Statement Download / Portal Guidance
                          </option>
                          <option value="New Credit Card Eligibility Inquiry">
                            New Credit Card Eligibility Inquiry
                          </option>
                        </select>
                      </div>
                    </div>

                    {!formState.safeCallbackOnly && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Card Issuer / Bank Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={formState.bankIssuer}
                            onChange={(e) =>
                              setFormState({ ...formState, bankIssuer: e.target.value })
                            }
                            placeholder="e.g., SBI, HDFC, ICICI, Axis"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Last 4 Digits ONLY (Optional)
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            value={formState.lastFourDigits}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                lastFourDigits: e.target.value.replace(/\D/g, '')
                              })
                            }
                            placeholder="XXXX (4 digits only)"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!formState.safeCallbackOnly && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        {activeServiceForForm.quantityType === 'amount'
                          ? 'Requested Amount in ₹ (if applicable)'
                          : 'Quantity / Number of Pages or Sets'}
                      </label>
                      <input
                        type="text"
                        value={formState.amountOrQty}
                        onChange={(e) =>
                          setFormState({ ...formState, amountOrQty: e.target.value })
                        }
                        placeholder={
                          activeServiceForForm.quantityType === 'amount'
                            ? 'e.g., ₹15,000'
                            : 'e.g., 2 Copies / 40 Pages'
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  )}
                  <div className={`space-y-1.5 ${formState.safeCallbackOnly ? 'sm:col-span-2' : ''}`}>
                    <label className="block text-xs font-semibold text-slate-700">
                      Preferred Date / Callback Time
                    </label>
                    <input
                      type="text"
                      value={formState.preferredDateTime}
                      onChange={(e) =>
                        setFormState({ ...formState, preferredDateTime: e.target.value })
                      }
                      placeholder="e.g., Today 5:30 PM or Tomorrow Morning"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Short Description / Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={formState.description}
                    onChange={(e) =>
                      setFormState({ ...formState, description: e.target.value })
                    }
                    placeholder="Briefly describe your requirement (Do NOT enter full card numbers)..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                {activeServiceForForm.requiresDoc && !activeServiceForForm.isCreditCard && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-dashed border-blue-300 space-y-2">
                    <label className="block text-xs font-semibold text-[#1E3A8A]">
                      Optional Document / PDF Upload (For Printing, PAN, PF, or Online Form)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormState({ ...formState, uploadedFileName: file.name });
                        }
                      }}
                      className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1E3A8A] file:text-white"
                    />
                    {formState.uploadedFileName && (
                      <p className="text-xs font-semibold text-emerald-700 mt-1">
                        ✓ Attached: {formState.uploadedFileName}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {activeServiceForForm.isCreditCard && (
                    <label className="flex items-start gap-3 text-xs text-slate-800 cursor-pointer leading-relaxed">
                      <input
                        type="checkbox"
                        checked={formState.ccSecurityConsent}
                        onChange={(e) =>
                          setFormState({ ...formState, ccSecurityConsent: e.target.checked })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-[#1E3A8A] shrink-0"
                      />
                      <span>
                        <strong>Security Acknowledgment:</strong> I understand Balaji Stationery never asks for full card numbers, CVV, PIN, OTP, or card photos.
                      </span>
                    </label>
                  )}

                  <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer leading-relaxed">
                    <input
                      type="checkbox"
                      checked={formState.consentPrivacy}
                      onChange={(e) =>
                        setFormState({ ...formState, consentPrivacy: e.target.checked })
                      }
                      className="mt-0.5 w-4 h-4 rounded text-[#1E3A8A] shrink-0"
                    />
                    <span>
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setLegalModal('privacy')}
                        className="text-[#1E3A8A] font-semibold underline"
                      >
                        Privacy Policy
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => setLegalModal('terms')}
                        className="text-[#1E3A8A] font-semibold underline"
                      >
                        Terms of Service
                      </button>{' '}
                      and authorize Balaji Stationery to contact me.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveServiceForForm(null)}
                    className="px-5 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#1E3A8A] hover:bg-blue-800 text-white font-semibold px-7 py-3 rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-colors"
                  >
                    <span>
                      {activeServiceForForm.isCreditCard
                        ? formState.safeCallbackOnly
                          ? 'Request Safe Callback Now'
                          : 'Submit Inquiry'
                        : 'Proceed to Payment Gateway'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-amber-300 shrink-0" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {legalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-semibold text-[#1E3A8A]">
                {legalModal === 'privacy'
                  ? 'Privacy Policy & Data Protection'
                  : 'Terms of Service & Fee Disclosure'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            {legalModal === 'privacy' ? (
              <div className="text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
                <p>
                  <strong>1. Minimal Data Collection:</strong> Balaji Stationery and Communications (Patancheru - 502319) collects only your name, mobile number, and service instructions necessary to fulfill your request.
                </p>
                <p>
                  <strong>2. Strict Financial Safety:</strong> We never collect or store full credit/debit card numbers, CVV, ATM PINs, OTPs, or internet banking passwords.
                </p>
                <p>
                  <strong>3. Document Privacy:</strong> Files uploaded for printing, PAN, or PF assistance are used strictly for completing your job and are deleted upon pickup.
                </p>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
                <p>
                  <strong>1. Authorized Citizen &amp; Stationery Assistance:</strong> We act as a facilitation center for printing, documentation, and official portal assistance.
                </p>
                <p>
                  <strong>2. Payment Gateway Scope:</strong> Online UPI/QR checkout is enabled only for standard stationery and documentation services. Credit card inquiries are excluded from online payment gateways.
                </p>
                <p>
                  <strong>3. Transparent Service Fees:</strong> All displayed prices in Indian Rupees (₹) represent standard shop facilitation charges. Government portal fees, if applicable, are receipted transparently.
                </p>
              </div>
            )}

            <div className="pt-3 text-right">
              <button
                onClick={() => setLegalModal(null)}
                className="bg-[#1E3A8A] text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#1E3A8A] text-blue-100 border-t-4 border-amber-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-semibold text-amber-300 text-base">
              {SHOP_INFO.name}
            </h4>
            <p className="text-white">{SHOP_INFO.tagline}</p>
            <p className="text-blue-200">{SHOP_INFO.address}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white text-base">Shop Contact &amp; Timings</h4>
            <p>Phone / WhatsApp: {SHOP_INFO.phoneDisplay}</p>
            <p>{SHOP_INFO.hours}</p>
            <p>PIN Code: 502319 (Patancheru, Telangana)</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white text-base">Customer Links</h4>
            <div className="flex flex-wrap gap-4 pt-1">
              <button
                onClick={() => setLegalModal('privacy')}
                className="text-amber-300 hover:underline font-medium"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setLegalModal('terms')}
                className="text-amber-300 hover:underline font-medium"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className="text-amber-300 hover:underline font-medium"
              >
                Track Request
              </button>
            </div>
            <p className="text-xs text-blue-200 pt-3 border-t border-blue-800">
              © {new Date().getFullYear()} Balaji Stationery and Communications. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}