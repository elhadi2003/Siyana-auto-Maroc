/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Wrench, 
  ShoppingCart, 
  MessageSquare, 
  AlertCircle, 
  Settings, 
  Star, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Phone, 
  Search,
  CheckCircle2,
  History,
  Info,
  Globe,
  Palette,
  Car,
  User,
  Sparkles,
  Send,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

// AI Initialization
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const aiModel = "gemini-3-flash-preview";

// Types
type Page = 'home' | 'services' | 'shop' | 'advice' | 'emergency' | 'settings' | 'history';
type Theme = 'white-red' | 'white-orange' | 'white-blue' | 'white-green' | 'white-purple' | 'black-red' | 'black-gold' | 'black-blue' | 'black-green' | 'black-orange' | 'black-purple';
type Language = 'en' | 'fr' | 'ar';

const TRANSLATIONS = {
  en: {
    appName: 'Siyana Auto',
    hello: 'Hello',
    home: 'Home',
    services: 'Services',
    shop: 'Shop',
    advice: 'Advice',
    emergency: 'Emergency',
    settings: 'Settings',
    history: 'History',
    bookService: 'Book Service',
    nearbyGarages: 'Nearby Garages',
    viewAll: 'View All',
    bookNow: 'Book Now',
    carSelection: 'Car Selection',
    selectBrand: 'Select Brand',
    selectModel: 'Select Model',
    year: 'Year',
    nextStep: 'Next Step',
    back: 'Back',
    selectServices: 'Select Services',
    selected: 'Selected',
    dateTime: 'Date & Time',
    findMechanics: 'Find Mechanics',
    suggestedMechanics: 'Suggested Mechanics',
    totalAmount: 'Total Amount',
    totalFor: 'Total for',
    checkout: 'Checkout',
    yourItems: 'Your Items',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    creditCard: 'Credit Card',
    payNow: 'Pay Now',
    aiDiagnostic: 'AI Diagnostic',
    aiAdviceDesc: 'Get instant advice from our AI mechanic',
    symptomsPlaceholder: "Describe your car's symptoms...",
    humanExpert: 'Human Expert',
    humanExpertDesc: 'Connect with a real mechanic for complex issues',
    fullName: 'Full Name',
    carType: 'Car Type',
    problemDesc: 'Problem Description',
    phoneNumber: 'Phone Number',
    sendRequest: 'Send Request',
    emergencyHelp: 'Emergency Help',
    emergencyDesc: "Stuck on the road? We'll send a mechanic immediately.",
    requestEmergency: 'Request Emergency Help',
    profile: 'Profile',
    appearance: 'Appearance',
    language: 'Language',
    backToHome: 'Back to Home',
    bookingConfirmed: 'Booking Confirmed!',
    orderPlaced: 'Order Placed!',
    requestSent: 'Request Sent!',
    helpOnWay: 'Help is on the Way!',
    bookingDesc: 'Your service has been scheduled successfully. The mechanic is notified.',
    orderDesc: 'Your parts are being prepared for delivery. You will receive a tracking link soon.',
    adviceDesc: 'Our experts have received your query and will contact you within 24 hours.',
    emergencySuccessDesc: 'We have dispatched an emergency unit to your location. Please stay with your vehicle.',
    expertAdvice: 'Expert Advice',
    expertAdviceSub: 'Describe your problem and our experts will help you',
    location: 'Your Location',
    bannerTitle: 'Expert Care for Your Car',
    bannerSub: 'Find the best mechanics near you',
    engineOil: 'Engine Oil Change',
    gearOil: 'Gearbox Oil Change',
    brakeService: 'Brake Service',
    diagnostic: 'Full Diagnostic',
    electricalRepair: 'Electrical Repair',
    batteryReplacement: 'Battery Replacement',
    airConditioning: 'A/C Service',
    engineRepair: 'Engine Repair',
    suspension: 'Suspension & Steering',
    tires: 'Tire Service',
    filters: 'Filter Replacement',
    engineOil5w30: 'Engine Oil 5W30',
    gearOilProd: 'Gearbox Oil',
    brakeFluid: 'Brake Fluid',
    steeringFluid: 'Steering Fluid',
    coolant: 'Coolant / Antifreeze',
    carBattery: 'Car Battery',
    brakePads: 'Plaquettes de frein',
    airFilter: 'Air Filter',
    sparkPlugs: 'Spark Plugs',
    towing: 'Towing Service',
    towingDesc: 'Flatbed or wheel-lift towing',
    batteryJump: 'Battery Jump',
    batteryJumpDesc: 'Dead battery? We will jumpstart it',
    flatTire: 'Flat Tire',
    flatTireDesc: 'Tire change or repair on spot',
    fuelDelivery: 'Fuel Delivery',
    fuelDeliveryDesc: 'Ran out of gas? We will bring some',
    callEmergency: 'Call our emergency hotline now',
    requestEmergencyHelp: 'Request Emergency Help',
    yourLocation: 'Your Location',
    maintenanceHistory: 'Maintenance History',
    aboutApp: 'About Siyana Auto',
    logout: 'Logout',
    aiErrorMessage: 'Sorry, our AI mechanic is currently busy. Please try again later.',
    editProfile: 'Edit Profile',
    myCars: 'My Cars',
    theme: 'Theme',
    themeWhiteRed: 'White + Red',
    themeWhiteOrange: 'White + Orange',
    themeWhiteBlue: 'White + Blue',
    themeWhiteGreen: 'White + Green',
    themeWhitePurple: 'White + Purple',
    themeBlackRed: 'Black + Red',
    themeBlackGold: 'Black + Gold',
    themeBlackBlue: 'Black + Blue',
    themeBlackGreen: 'Black + Green',
    themeBlackOrange: 'Black + Orange',
    themeBlackPurple: 'Black + Purple',
  },
  ar: {
    appName: 'صيانة أوتو',
    hello: 'مرحباً',
    home: 'الرئيسية',
    services: 'الخدمات',
    shop: 'المتجر',
    advice: 'استشارة',
    emergency: 'طوارئ',
    settings: 'الإعدادات',
    history: 'السجل',
    bookService: 'حجز خدمة',
    nearbyGarages: 'ورش قريبة',
    viewAll: 'عرض الكل',
    bookNow: 'احجز الآن',
    carSelection: 'اختيار السيارة',
    selectBrand: 'اختر الماركة',
    selectModel: 'اختر الموديل',
    year: 'السنة',
    nextStep: 'الخطوة التالية',
    back: 'رجوع',
    selectServices: 'اختر الخدمات',
    selected: 'مختار',
    dateTime: 'التاريخ والوقت',
    findMechanics: 'البحث عن ميكانيكي',
    suggestedMechanics: 'ميكانيكيون مقترحون',
    totalAmount: 'المبلغ الإجمالي',
    totalFor: 'الإجمالي لـ',
    checkout: 'الدفع',
    yourItems: 'منتجاتك',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع عند الاستلام',
    creditCard: 'بطاقة ائتمان',
    payNow: 'ادفع الآن',
    aiDiagnostic: 'تشخيص الذكاء الاصطناعي',
    aiAdviceDesc: 'احصل على نصيحة فورية من ميكانيكي الذكاء الاصطناعي',
    symptomsPlaceholder: 'صف أعراض سيارتك...',
    humanExpert: 'خبير بشري',
    humanExpertDesc: 'تواصل مع ميكانيكي حقيقي للمشاكل المعقدة',
    fullName: 'الاسم الكامل',
    carType: 'نوع السيارة',
    problemDesc: 'وصف المشكلة',
    phoneNumber: 'رقم الهاتف',
    sendRequest: 'إرسال الطلب',
    emergencyHelp: 'مساعدة طارئة',
    emergencyDesc: 'عالق في الطريق؟ سنرسل لك ميكانيكياً فوراً.',
    requestEmergency: 'طلب مساعدة طارئة',
    profile: 'الملف الشخصي',
    appearance: 'المظهر',
    language: 'اللغة',
    backToHome: 'العودة للرئيسية',
    bookingConfirmed: 'تم تأكيد الحجز!',
    orderPlaced: 'تم تقديم الطلب!',
    requestSent: 'تم إرسال الطلب!',
    helpOnWay: 'المساعدة في الطريق!',
    bookingDesc: 'تمت جدولة خدمتك بنجاح. تم إخطار الميكانيكي.',
    orderDesc: 'يتم تحضير قطع الغيار للتوصيل. ستتلقى رابط التتبع قريباً.',
    adviceDesc: 'تلقى خبراؤنا استفسارك وسيتصلون بك خلال 24 ساعة.',
    emergencySuccessDesc: 'لقد أرسلنا وحدة طوارئ إلى موقعك. يرجى البقاء مع مركبتك.',
    expertAdvice: 'نصيحة الخبراء',
    expertAdviceSub: 'صف مشكلتك وسيساعدك خبراؤنا',
    location: 'موقعك',
    bannerTitle: 'عناية خبيرة بسيارتك',
    bannerSub: 'ابحث عن أفضل الميكانيكيين بالقرب منك',
    engineOil: 'تغيير زيت المحرك',
    gearOil: 'تغيير زيت علبة التروس',
    brakeService: 'خدمة الفرامل',
    diagnostic: 'تشخيص كامل',
    electricalRepair: 'إصلاح كهربائي',
    batteryReplacement: 'تبديل البطارية',
    airConditioning: 'خدمة التكييف',
    engineRepair: 'إصلاح المحرك',
    suspension: 'نظام التعليق والتوجيه',
    tires: 'خدمة الإطارات',
    filters: 'تبديل الفلاتر',
    engineOil5w30: 'زيت محرك 5W30',
    gearOilProd: 'زيت علبة التروس',
    brakeFluid: 'سائل الفرامل',
    steeringFluid: 'سائل التوجيه',
    coolant: 'سائل التبريد / مضاد التجمد',
    carBattery: 'بطارية سيارة',
    brakePads: 'تيل الفرامل',
    airFilter: 'فلتر هواء',
    sparkPlugs: 'شمعات الاحتراق',
    towing: 'خدمة السحب',
    towingDesc: 'سحب مسطح أو برفع العجلات',
    batteryJump: 'تنشيط البطارية',
    batteryJumpDesc: 'بطارية فارغة؟ سنقوم بتشغيلها',
    flatTire: 'إطار مثقوب',
    flatTireDesc: 'تغيير أو إصلاح الإطارات في الموقع',
    fuelDelivery: 'توصيل الوقود',
    fuelDeliveryDesc: 'نفد الوقود؟ سنحضر لك البعض',
    callEmergency: 'اتصل بخط الطوارئ الخاص بنا الآن',
    requestEmergencyHelp: 'طلب مساعدة طارئة',
    yourLocation: 'موقعك',
    maintenanceHistory: 'سجل الصيانة',
    aboutApp: 'حول صيانة أوتو',
    logout: 'تسجيل الخروج',
    aiErrorMessage: 'عذراً، ميكانيكي الذكاء الاصطناعي مشغول حالياً. يرجى المحاولة لاحقاً.',
    editProfile: 'تعديل الملف الشخصي',
    myCars: 'سياراتي',
    theme: 'المظهر',
    themeWhiteRed: 'أبيض + أحمر',
    themeWhiteOrange: 'أبيض + برتقالي',
    themeWhiteBlue: 'أبيض + أزرق',
    themeWhiteGreen: 'أبيض + أخضر',
    themeWhitePurple: 'أبيض + بنفسجي',
    themeBlackRed: 'أسود + أحمر',
    themeBlackGold: 'أسود + ذهبي',
    themeBlackBlue: 'أسود + أزرق',
    themeBlackGreen: 'أسود + أخضر',
    themeBlackOrange: 'أسود + برتقالي',
    themeBlackPurple: 'أسود + بنفسجي',
  },
  fr: {
    appName: 'Siyana Auto',
    hello: 'Bonjour',
    home: 'Accueil',
    services: 'Services',
    shop: 'Boutique',
    advice: 'Conseils',
    emergency: 'Urgence',
    settings: 'Paramètres',
    history: 'Historique',
    bookService: 'Réserver un service',
    nearbyGarages: 'Garages à proximité',
    viewAll: 'Voir tout',
    bookNow: 'Réserver',
    carSelection: 'Sélection de voiture',
    selectBrand: 'Choisir la marque',
    selectModel: 'Choisir le modèle',
    year: 'Année',
    nextStep: 'Étape suivante',
    back: 'Retour',
    selectServices: 'Choisir les services',
    selected: 'Sélectionné',
    dateTime: 'Date et Heure',
    findMechanics: 'Trouver des mécaniciens',
    suggestedMechanics: 'Mécaniciens suggérés',
    totalAmount: 'Montant total',
    totalFor: 'Total pour',
    checkout: 'Paiement',
    yourItems: 'Vos articles',
    paymentMethod: 'Mode de paiement',
    cashOnDelivery: 'Paiement à la livraison',
    creditCard: 'Carte de crédit',
    payNow: 'Payer maintenant',
    aiDiagnostic: 'Diagnostic IA',
    aiAdviceDesc: 'Conseils instantanés de notre mécanicien IA',
    symptomsPlaceholder: 'Décrivez les symptômes...',
    humanExpert: 'Expert humain',
    humanExpertDesc: 'Contactez un vrai mécanicien',
    fullName: 'Nom complet',
    carType: 'Type de voiture',
    problemDesc: 'Description du problème',
    phoneNumber: 'Numéro de téléphone',
    sendRequest: 'Envoyer la demande',
    emergencyHelp: 'Aide d\'urgence',
    emergencyDesc: 'Bloqué sur la route ? Nous envoyons un mécanicien.',
    requestEmergency: 'Demander de l\'aide',
    profile: 'Profil',
    appearance: 'Apparence',
    language: 'Langue',
    backToHome: 'Retour à l\'accueil',
    bookingConfirmed: 'Réservation confirmée !',
    orderPlaced: 'Commande passée !',
    requestSent: 'Demande envoyée !',
    helpOnWay: 'L\'aide est en route !',
    bookingDesc: 'Votre service a été programmé avec succès. Le mécanicien est informé.',
    orderDesc: 'Vos pièces sont en cours de préparation. Vous recevrez bientôt un lien de suivi.',
    adviceDesc: 'Nos experts ont reçu votre demande et vous contacteront sous 24h.',
    emergencySuccessDesc: 'Nous avons envoyé une unité d\'urgence. Veuillez rester avec votre véhicule.',
    expertAdvice: 'Conseils d\'experts',
    expertAdviceSub: 'Décrivez votre problème et nos experts vous aideront',
    location: 'Votre emplacement',
    bannerTitle: 'Soin expert pour votre voiture',
    bannerSub: 'Trouvez les meilleurs mécaniciens',
    engineOil: 'Vidange d\'huile moteur',
    gearOil: 'Vidange boîte de vitesses',
    brakeService: 'Service de freinage',
    diagnostic: 'Diagnostic complet',
    electricalRepair: 'Réparation électrique',
    batteryReplacement: 'Remplacement batterie',
    airConditioning: 'Service climatisation',
    engineRepair: 'Réparation moteur',
    suspension: 'Suspension et direction',
    tires: 'Service de pneus',
    filters: 'Remplacement de filtres',
    engineOil5w30: 'Huile moteur 5W30',
    gearOilProd: 'Huile de boîte',
    brakeFluid: 'Liquide de frein',
    steeringFluid: 'Liquide de direction',
    coolant: 'Liquide de refroidissement',
    carBattery: 'Batterie voiture',
    brakePads: 'Plaquettes de frein',
    airFilter: 'Filtre à air',
    sparkPlugs: 'Bougies d\'allumage',
    towing: 'Service de remorquage',
    towingDesc: 'Remorquage plateau ou levage',
    batteryJump: 'Démarrage batterie',
    batteryJumpDesc: 'Batterie à plat ? Nous la redémarrons',
    flatTire: 'Pneu crevé',
    flatTireDesc: 'Changement ou réparation sur place',
    fuelDelivery: 'Livraison de carburant',
    fuelDeliveryDesc: 'Plus d\'essence ? Nous en apportons',
    callEmergency: 'Appelez notre hotline d\'urgence maintenant',
    requestEmergencyHelp: 'Demander de l\'aide d\'urgence',
    yourLocation: 'Votre emplacement',
    maintenanceHistory: 'Historique d\'entretien',
    aboutApp: 'À propos de Siyana Auto',
    logout: 'Déconnexion',
    aiErrorMessage: 'Désolé, notre mécanicien IA est occupé. Veuillez réessayer plus tard.',
    editProfile: 'Modifier le profil',
    myCars: 'Mes voitures',
    theme: 'Thème',
    themeWhiteRed: 'Blanc + Rouge',
    themeWhiteOrange: 'Blanc + Orange',
    themeWhiteBlue: 'Blanc + Bleu',
    themeWhiteGreen: 'Blanc + Vert',
    themeWhitePurple: 'Blanc + Violet',
    themeBlackRed: 'Noir + Rouge',
    themeBlackGold: 'Noir + Or',
    themeBlackBlue: 'Noir + Bleu',
    themeBlackGreen: 'Noir + Vert',
    themeBlackOrange: 'Noir + Orange',
    themeBlackPurple: 'Noir + Violet',
  }
};

interface Service {
  id: string;
  nameKey: keyof typeof TRANSLATIONS.en;
  icon: React.ReactNode;
  price: string;
}

interface Product {
  id: string;
  nameKey: string;
  price: string;
  image: string;
}

interface Mechanic {
  id: string;
  name: string;
  rating: number;
  distance: string;
  city: string;
  image: string;
  priceEstimate: string;
}

// Constants
const THEMES: Record<Theme, { primary: string; bg: string; card: string; text: string; sub: string }> = {
  'white-red': { primary: 'bg-red-600', bg: 'bg-slate-50', card: 'bg-white', text: 'text-slate-900', sub: 'text-slate-500' },
  'white-orange': { primary: 'bg-orange-600', bg: 'bg-slate-50', card: 'bg-white', text: 'text-slate-900', sub: 'text-slate-500' },
  'white-blue': { primary: 'bg-blue-600', bg: 'bg-slate-50', card: 'bg-white', text: 'text-slate-900', sub: 'text-slate-500' },
  'white-green': { primary: 'bg-emerald-600', bg: 'bg-slate-50', card: 'bg-white', text: 'text-slate-900', sub: 'text-slate-500' },
  'white-purple': { primary: 'bg-purple-600', bg: 'bg-slate-50', card: 'bg-white', text: 'text-slate-900', sub: 'text-slate-500' },
  'black-red': { primary: 'bg-red-600', bg: 'bg-zinc-950', card: 'bg-zinc-900', text: 'text-zinc-100', sub: 'text-zinc-400' },
  'black-gold': { primary: 'bg-amber-500', bg: 'bg-zinc-950', card: 'bg-zinc-900', text: 'text-zinc-100', sub: 'text-zinc-400' },
  'black-blue': { primary: 'bg-blue-500', bg: 'bg-zinc-950', card: 'bg-zinc-900', text: 'text-zinc-100', sub: 'text-zinc-400' },
  'black-green': { primary: 'bg-emerald-500', bg: 'bg-zinc-950', card: 'bg-zinc-900', text: 'text-zinc-100', sub: 'text-zinc-400' },
  'black-orange': { primary: 'bg-orange-500', bg: 'bg-zinc-950', card: 'bg-zinc-900', text: 'text-zinc-100', sub: 'text-zinc-400' },
  'black-purple': { primary: 'bg-purple-500', bg: 'bg-zinc-950', card: 'bg-zinc-900', text: 'text-zinc-100', sub: 'text-zinc-400' },
};

const SERVICES: Service[] = [
  { id: '1', nameKey: 'engineOil' as any, icon: <Wrench className="w-6 h-6" />, price: '450 MAD' },
  { id: '2', nameKey: 'gearOil' as any, icon: <Wrench className="w-6 h-6" />, price: '600 MAD' },
  { id: '3', nameKey: 'brakeService' as any, icon: <Wrench className="w-6 h-6" />, price: '800 MAD' },
  { id: '4', nameKey: 'diagnostic' as any, icon: <Search className="w-6 h-6" />, price: '300 MAD' },
  { id: '5', nameKey: 'electricalRepair' as any, icon: <AlertCircle className="w-6 h-6" />, price: '500+ MAD' },
  { id: '6', nameKey: 'batteryReplacement' as any, icon: <AlertCircle className="w-6 h-6" />, price: '1200 MAD' },
  { id: '7', nameKey: 'airConditioning' as any, icon: <Wrench className="w-6 h-6" />, price: '700 MAD' },
  { id: '8', nameKey: 'engineRepair' as any, icon: <Wrench className="w-6 h-6" />, price: '2000+ MAD' },
  { id: '9', nameKey: 'suspension' as any, icon: <Wrench className="w-6 h-6" />, price: '1500 MAD' },
  { id: '10', nameKey: 'tires' as any, icon: <Wrench className="w-6 h-6" />, price: '1000+ MAD' },
  { id: '11', nameKey: 'filters' as any, icon: <Wrench className="w-6 h-6" />, price: '250 MAD' },
];

const PRODUCTS: Product[] = [
  { id: '1', nameKey: 'engineOil5w30', price: '350 MAD', image: 'https://picsum.photos/seed/abstract-oil/400/300' },
  { id: '2', nameKey: 'gearOilProd', price: '250 MAD', image: 'https://picsum.photos/seed/abstract-gearoil/400/300' },
  { id: '3', nameKey: 'brakeFluid', price: '150 MAD', image: 'https://picsum.photos/seed/abstract-brakefluid/400/300' },
  { id: '4', nameKey: 'steeringFluid', price: '120 MAD', image: 'https://picsum.photos/seed/abstract-steering/400/300' },
  { id: '5', nameKey: 'coolant', price: '200 MAD', image: 'https://picsum.photos/seed/abstract-coolant/400/300' },
  { id: '6', nameKey: 'carBattery', price: '1100 MAD', image: 'https://picsum.photos/seed/abstract-battery/400/300' },
  { id: '7', nameKey: 'brakePads', price: '450 MAD', image: 'https://picsum.photos/seed/abstract-brakepads/400/300' },
  { id: '8', nameKey: 'airFilter', price: '180 MAD', image: 'https://picsum.photos/seed/abstract-airfilter/400/300' },
  { id: '9', nameKey: 'sparkPlugs', price: '320 MAD', image: 'https://picsum.photos/seed/abstract-spark/400/300' },
  { id: '10', nameKey: 'wiperBlades', price: '150 MAD', image: 'https://picsum.photos/seed/abstract-wiper/400/300' },
  { id: '11', nameKey: 'headlightBulb', price: '90 MAD', image: 'https://picsum.photos/seed/abstract-bulb/400/300' },
  { id: '12', nameKey: 'fuelFilter', price: '210 MAD', image: 'https://picsum.photos/seed/abstract-fuelfilter/400/300' },
  { id: '13', nameKey: 'oilFilter', price: '120 MAD', image: 'https://picsum.photos/seed/abstract-oilfilter/400/300' },
  { id: '14', nameKey: 'timingBelt', price: '1200 MAD', image: 'https://picsum.photos/seed/abstract-belt/400/300' },
  { id: '15', nameKey: 'shockAbsorber', price: '850 MAD', image: 'https://picsum.photos/seed/abstract-shock/400/300' },
  { id: '16', nameKey: 'clutchKit', price: '2500 MAD', image: 'https://picsum.photos/seed/abstract-clutch/400/300' },
];

const CAR_MODELS: Record<string, string[]> = {
  'toyota': ['Corolla', 'Yaris', 'Hilux', 'Rav4', 'Land Cruiser'],
  'mercedes': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE'],
  'bmw': ['3 Series', '5 Series', 'X3', 'X5', '7 Series'],
  'audi': ['A3', 'A4', 'A6', 'Q3', 'Q5'],
  'dacia': ['Logan', 'Sandero', 'Duster', 'Dokker'],
  'renault': ['Clio', 'Megane', 'Captur', 'Kadjar'],
};

const MECHANICS: Mechanic[] = [
  { id: '1', name: 'AutoPro Garage', rating: 4.8, distance: '1.2 km', city: 'Casablanca', image: 'https://picsum.photos/seed/abstract-garage1/400/300', priceEstimate: '450 MAD' },
  { id: '2', name: 'Elite Motors', rating: 4.6, distance: '2.5 km', city: 'Casablanca', image: 'https://picsum.photos/seed/abstract-garage2/400/300', priceEstimate: '500 MAD' },
  { id: '3', name: 'QuickFix Mechanics', rating: 4.9, distance: '0.8 km', city: 'Casablanca', image: 'https://picsum.photos/seed/abstract-garage3/400/300', priceEstimate: '400 MAD' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('white-red');
  const [language, setLanguage] = useState<Language>('fr');
  const [serviceStep, setServiceStep] = useState(1);
  const [selectedCar, setSelectedCar] = useState({ brand: '', model: '', year: '' });
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState<'booking' | 'order' | 'advice' | 'emergency' | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [userProfile] = useState({ name: 'YASSINE ELHADI', email: 'yassine.elhadi@example.com' });

  const currentTheme = THEMES[theme];

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return (TRANSLATIONS[language] as any)[key] || (TRANSLATIONS.en as any)[key] || key;
  };

  const translateItem = (item: any) => {
    const key = item.nameKey;
    const names: any = {
      engineOil: { en: 'Engine Oil Change', ar: 'تغيير زيت المحرك', fr: 'Vidange d\'huile moteur' },
      gearOil: { en: 'Gear Oil', ar: 'زيت علبة التروس', fr: 'Huile de boîte' },
      brakeService: { en: 'Brake Service', ar: 'صيانة الفرامل', fr: 'Service de freinage' },
      diagnostic: { en: 'Diagnostic', ar: 'تشخيص الأعطال', fr: 'Diagnostic' },
      electricalRepair: { en: 'Electrical Repair', ar: 'إصلاح الكهرباء', fr: 'Réparation électrique' },
      batteryReplacement: { en: 'Battery Replacement', ar: 'استبدال البطارية', fr: 'Remplacement batterie' },
      airConditioning: { en: 'Air Conditioning', ar: 'تكييف الهواء', fr: 'Climatisation' },
      engineRepair: { en: 'Engine Repair', ar: 'إصلاح المحرك', fr: 'Réparation moteur' },
      suspension: { en: 'Suspension', ar: 'نظام التعليق', fr: 'Suspension' },
      tires: { en: 'Tires', ar: 'الإطارات', fr: 'Pneus' },
      filters: { en: 'Filters', ar: 'الفلاتر', fr: 'Filtres' },
      engineOil5w30: { en: 'Engine Oil 5W30', ar: 'زيت محرك 5W30', fr: 'Huile moteur 5W30' },
      gearOilProd: { en: 'Gear Oil', ar: 'زيت علبة التروس', fr: 'Huile de boîte' },
      brakeFluid: { en: 'Brake Fluid', ar: 'سائل الفرامل', fr: 'Liquide de frein' },
      steeringFluid: { en: 'Steering Fluid', ar: 'سائل التوجيه', fr: 'Liquide de direction' },
      coolant: { en: 'Coolant', ar: 'سائل التبريد', fr: 'Liquide de refroidissement' },
      carBattery: { en: 'Car Battery', ar: 'بطارية سيارة', fr: 'Batterie voiture' },
      brakePads: { en: 'Brake Pads', ar: 'صفائح الفرامل', fr: 'Plaquettes de frein' },
      airFilter: { en: 'Air Filter', ar: 'فلتر الهواء', fr: 'Filtre à air' },
      sparkPlugs: { en: 'Spark Plugs', ar: 'شمعات الاحتراق', fr: 'Bougies d\'allumage' },
      wiperBlades: { en: 'Wiper Blades', ar: 'مساحات الزجاج', fr: 'Essuie-glaces' },
      headlightBulb: { en: 'Headlight Bulb', ar: 'مصباح أمامي', fr: 'Ampoule phare' },
      fuelFilter: { en: 'Fuel Filter', ar: 'فلتر الوقود', fr: 'Filtre à carburant' },
      oilFilter: { en: 'Oil Filter', ar: 'فلتر الزيت', fr: 'Filtre à huile' },
      timingBelt: { en: 'Timing Belt Kit', ar: 'طقم حزام التوقيت', fr: 'Kit courroie de distribution' },
      shockAbsorber: { en: 'Shock Absorber', ar: 'ممتص الصدمات', fr: 'Amortisseur' },
      clutchKit: { en: 'Clutch Kit', ar: 'طقم القابض', fr: 'Kit d\'embrayage' },
    };
    return names[key]?.[language] || names[key]?.en || key;
  };

  const handleAiAdvice = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const result = await genAI.models.generateContent({
        model: aiModel,
        contents: `As a professional car mechanic, give advice for this car problem: ${aiQuery}. Keep it concise and helpful.`,
      });
      setAiResponse(result.text);
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponse(t('aiErrorMessage'));
    } finally {
      setIsAiLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + parseInt(item.price), 0);
  };

  const handleSubmission = (type: 'booking' | 'order' | 'advice' | 'emergency') => {
    setSubmissionType(type);
    setIsSubmitted(true);
    setShowCheckout(false);
    if (type === 'order') setCart([]);
    if (type === 'booking') {
      setServiceStep(1);
      setSelectedServices([]);
    }
  };

  const renderCheckout = () => (
    <motion.div 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }}
      className="fixed inset-0 z-[110] flex flex-col bg-black/60 backdrop-blur-sm"
    >
      <div className="mt-auto max-h-[90vh] overflow-y-auto rounded-t-[40px] bg-white dark:bg-zinc-900 p-6 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-black ${currentTheme.text}`}>{t('checkout')}</h2>
          <button onClick={() => setShowCheckout(false)} className={`p-2 rounded-full ${currentTheme.bg} ${currentTheme.text}`}>
            <AlertCircle className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <div className="space-y-4">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${currentTheme.sub}`}>{t('yourItems')}</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800">
              <div className="flex items-center gap-3">
                <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className={`font-bold text-sm ${currentTheme.text}`}>{translateItem(item)}</p>
                  <p className="text-orange-600 text-xs font-bold">{item.price}</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${currentTheme.sub}`}>{t('paymentMethod')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                paymentMethod === 'cash' ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-100 dark:border-zinc-800'
              }`}
            >
              <span className="text-2xl">💵</span>
              <span className={`text-xs font-bold ${currentTheme.text}`}>{t('cashOnDelivery')}</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                paymentMethod === 'card' ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-100 dark:border-zinc-800'
              }`}
            >
              <span className="text-2xl">💳</span>
              <span className={`text-xs font-bold ${currentTheme.text}`}>{t('creditCard')}</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-orange-600 text-white flex justify-between items-center">
          <div>
            <p className="text-xs opacity-80">{t('totalAmount')}</p>
            <p className="text-xl font-black">{calculateTotal()} MAD</p>
          </div>
          <button 
            onClick={() => handleSubmission('order')}
            className="bg-white text-orange-600 px-6 py-2 rounded-xl font-black shadow-lg"
          >
            {t('payNow')}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderSuccessView = () => {
    const content = {
      booking: { title: t('bookingConfirmed'), desc: t('bookingDesc'), icon: <CheckCircle2 className="w-16 h-16 text-green-500" /> },
      order: { title: t('orderPlaced'), desc: t('orderDesc'), icon: <ShoppingCart className="w-16 h-16 text-blue-500" /> },
      advice: { title: t('requestSent'), desc: t('adviceDesc'), icon: <MessageSquare className="w-16 h-16 text-green-500" /> },
      emergency: { title: t('helpOnWay'), desc: t('emergencySuccessDesc'), icon: <AlertCircle className="w-16 h-16 text-red-500" /> },
    }[submissionType || 'booking'];

    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      >
        <div className={`${currentTheme.card} w-full max-w-sm rounded-[40px] p-8 text-center space-y-6 shadow-2xl border border-white/10`}>
          <div className="flex justify-center">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: 'spring', damping: 12 }}
            >
              {content.icon}
            </motion.div>
          </div>
          <div className="space-y-2">
            <h2 className={`text-2xl font-black ${currentTheme.text}`}>{content.title}</h2>
            <p className={`${currentTheme.sub} text-sm leading-relaxed`}>{content.desc}</p>
          </div>
          <button 
            onClick={() => {
              setIsSubmitted(false);
              setCurrentPage('home');
            }}
            className={`w-full py-4 rounded-2xl ${currentTheme.primary} text-white font-black shadow-lg hover:brightness-110 transition-all`}
          >
            {t('backToHome')}
          </button>
        </div>
      </motion.div>
    );
  };

  const renderHeader = () => (
    <header className={`p-4 flex items-center justify-between sticky top-0 z-50 ${currentTheme.card} border-b border-slate-200 dark:border-zinc-800`}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png" 
            alt="Siyana Auto Logo" 
            className="w-10 h-10 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className={`text-xl font-bold ${currentTheme.text}`}>{t('appName')}</h1>
          <p className={`text-xs ${currentTheme.sub}`}>{t('hello')}, {userProfile.name}</p>
        </div>
      </div>
      <button onClick={() => setCurrentPage('settings')} className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 ${currentTheme.text}`}>
        <Settings className="w-6 h-6" />
      </button>
    </header>
  );

  const renderBottomNav = () => (
    <nav className={`fixed bottom-0 left-0 right-0 p-2 flex justify-around items-center ${currentTheme.card} border-t border-slate-200 dark:border-zinc-800 z-50`}>
      {[
        { id: 'home', icon: Home, labelKey: 'home' },
        { id: 'services', icon: Wrench, labelKey: 'services' },
        { id: 'shop', icon: ShoppingCart, labelKey: 'shop' },
        { id: 'advice', icon: MessageSquare, labelKey: 'advice' },
        { id: 'emergency', icon: AlertCircle, labelKey: 'emergency' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentPage(item.id as Page)}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
            currentPage === item.id ? `${currentTheme.text} font-bold` : `${currentTheme.sub}`
          }`}
        >
          <item.icon className={`w-6 h-6 ${currentPage === item.id ? 'text-orange-600' : ''}`} />
          <span className="text-[10px] mt-1">{t(item.labelKey as any)}</span>
        </button>
      ))}
    </nav>
  );

  const renderHome = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-6">
      {/* Banner */}
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl">
        <img 
          src="https://picsum.photos/seed/abstract-banner/800/400" 
          alt="Professional Mechanic" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <h2 className="text-white text-2xl font-bold">{t('bannerTitle')}</h2>
          <p className="text-white/80 text-sm">{t('bannerSub')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'services', labelKey: 'bookService', icon: Wrench, color: 'bg-orange-100 text-orange-600' },
          { id: 'emergency', labelKey: 'emergency', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
          { id: 'shop', labelKey: 'shop', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
          { id: 'advice', labelKey: 'advice', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
        ].map((action) => (
          <button
            key={action.id}
            onClick={() => setCurrentPage(action.id as Page)}
            className={`${currentTheme.card} p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow`}
          >
            <div className={`p-3 rounded-xl ${action.color}`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className={`text-sm font-semibold ${currentTheme.text}`}>{t(action.labelKey as any)}</span>
          </button>
        ))}
      </div>

      {/* Nearby Garages */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold ${currentTheme.text}`}>{t('nearbyGarages')}</h3>
          <button className="text-orange-600 text-sm font-semibold">{t('viewAll')}</button>
        </div>
        <div className="space-y-4">
          {MECHANICS.map((mech) => (
            <div key={mech.id} className={`${currentTheme.card} p-3 rounded-2xl shadow-sm flex gap-4`}>
              <img 
                src={mech.image} 
                alt={mech.name} 
                className="w-20 h-20 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <h4 className={`font-bold ${currentTheme.text}`}>{mech.name}</h4>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className={currentTheme.text}>{mech.rating}</span>
                  <span className={currentTheme.sub}>• {mech.distance} • {mech.city}</span>
                </div>
                <button 
                  onClick={() => {
                    setCurrentPage('services');
                    setServiceStep(4);
                  }}
                  className={`mt-2 px-4 py-1.5 rounded-lg ${currentTheme.primary} text-white text-xs font-bold`}
                >
                  {t('bookNow')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );

  const renderServices = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              serviceStep >= step ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step}
            </div>
            <div className={`h-1 w-full rounded-full ${serviceStep > step ? 'bg-orange-600' : 'bg-slate-200'}`} />
          </div>
        ))}
      </div>

      {serviceStep === 1 && (
        <div className="space-y-4">
          <h3 className={`text-xl font-bold ${currentTheme.text}`}>{t('carSelection')}</h3>
          <div className="space-y-3">
            <select 
              className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.card} ${currentTheme.text}`}
              onChange={(e) => setSelectedCar({ ...selectedCar, brand: e.target.value, model: '' })}
              value={selectedCar.brand}
            >
              <option value="">{t('selectBrand')}</option>
              <option value="toyota">Toyota</option>
              <option value="mercedes">Mercedes</option>
              <option value="bmw">BMW</option>
              <option value="audi">Audi</option>
              <option value="dacia">Dacia</option>
              <option value="renault">Renault</option>
            </select>
            <select 
              className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.card} ${currentTheme.text} disabled:opacity-50`}
              onChange={(e) => setSelectedCar({ ...selectedCar, model: e.target.value })}
              value={selectedCar.model}
              disabled={!selectedCar.brand}
            >
              <option value="">{t('selectModel')}</option>
              {selectedCar.brand && CAR_MODELS[selectedCar.brand]?.map(model => (
                <option key={model} value={model.toLowerCase()}>{model}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder={t('year')} 
              className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.card} ${currentTheme.text}`}
              onChange={(e) => setSelectedCar({ ...selectedCar, year: e.target.value })}
            />
          </div>
          <button 
            disabled={!selectedCar.brand || !selectedCar.model}
            onClick={() => setServiceStep(2)}
            className={`w-full p-4 rounded-xl ${currentTheme.primary} text-white font-bold disabled:opacity-50`}
          >
            {t('nextStep')}
          </button>
        </div>
      )}

      {serviceStep === 2 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className={`text-xl font-bold ${currentTheme.text}`}>{t('selectServices')}</h3>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
              {selectedServices.length} {t('selected')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((svc) => {
              const isSelected = selectedServices.some(s => s.id === svc.id);
              return (
                <button
                  key={svc.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedServices(selectedServices.filter(s => s.id !== svc.id));
                    } else {
                      setSelectedServices([...selectedServices, svc]);
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    isSelected 
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' 
                      : 'border-transparent ' + currentTheme.card
                  }`}
                >
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
                    {svc.icon}
                  </div>
                  <span className={`text-xs font-bold text-center ${currentTheme.text}`}>{translateItem(svc)}</span>
                  <span className="text-orange-600 text-xs font-bold">{svc.price}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setServiceStep(1)} className={`flex-1 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.text} font-bold`}>{t('back')}</button>
            <button 
              disabled={selectedServices.length === 0}
              onClick={() => setServiceStep(3)}
              className={`flex-1 p-4 rounded-xl ${currentTheme.primary} text-white font-bold disabled:opacity-50`}
            >
              {t('nextStep')}
            </button>
          </div>
        </div>
      )}

      {serviceStep === 3 && (
        <div className="space-y-4">
          <h3 className={`text-xl font-bold ${currentTheme.text}`}>{t('dateTime')}</h3>
          <div className="space-y-4">
            <input 
              type="date" 
              className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.card} ${currentTheme.text}`}
              onChange={(e) => setBookingDate(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-2">
              {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                <button
                  key={time}
                  onClick={() => setBookingTime(time)}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                    bookingTime === time 
                      ? 'bg-orange-600 border-orange-600 text-white' 
                      : `border-slate-200 dark:border-zinc-800 ${currentTheme.text}`
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setServiceStep(2)} className={`flex-1 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.text} font-bold`}>{t('back')}</button>
            <button 
              disabled={!bookingDate || !bookingTime}
              onClick={() => setServiceStep(4)}
              className={`flex-1 p-4 rounded-xl ${currentTheme.primary} text-white font-bold disabled:opacity-50`}
            >
              {t('findMechanics')}
            </button>
          </div>
        </div>
      )}

      {serviceStep === 4 && (
        <div className="space-y-4">
          <h3 className={`text-xl font-bold ${currentTheme.text}`}>{t('suggestedMechanics')}</h3>
          <div className="space-y-4">
            {MECHANICS.map((mech) => (
              <div key={mech.id} className={`${currentTheme.card} p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800`}>
                <div className="flex gap-4">
                  <img src={mech.image} alt={mech.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h4 className={`font-bold ${currentTheme.text}`}>{mech.name}</h4>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className={currentTheme.text}>{mech.rating}</span>
                      <span className={currentTheme.sub}>• {mech.distance}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-orange-600 font-bold">
                          {selectedServices.length > 0 
                            ? `${selectedServices.reduce((sum, s) => sum + parseInt(s.price), 0)} MAD`
                            : mech.priceEstimate}
                        </span>
                        <span className="text-[10px] text-slate-400">{t('totalFor')} {selectedServices.length} {t('services')}</span>
                      </div>
                      <button 
                        onClick={() => handleSubmission('booking')}
                        className={`px-6 py-2 rounded-xl ${currentTheme.primary} text-white text-sm font-bold`}
                      >
                        {t('bookNow')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setServiceStep(3)} className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.text} font-bold`}>{t('back')}</button>
        </div>
      )}
    </motion.div>
  );

  const renderShop = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-orange-600" />
          <h2 className={`text-2xl font-bold ${currentTheme.text}`}>{t('shop')}</h2>
        </div>
        <button 
          onClick={() => cart.length > 0 && setShowCheckout(true)}
          className={`relative p-2 rounded-xl ${currentTheme.card} border border-slate-200 dark:border-zinc-800`}
        >
          <ShoppingCart className="w-6 h-6 text-orange-600" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {PRODUCTS.map((product) => (
          <div key={product.id} className={`${currentTheme.card} rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-800`}>
            <img src={product.image} alt={translateItem(product)} className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
            <div className="p-3">
              <h4 className={`font-bold text-sm ${currentTheme.text}`}>{translateItem(product)}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-orange-600 font-bold">{product.price}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className={`p-2 rounded-lg ${currentTheme.primary} text-white`}
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderAdvice = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600`}>
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
        <h2 className={`text-2xl font-bold ${currentTheme.text}`}>{t('aiDiagnostic')}</h2>
        <p className={currentTheme.sub}>{t('aiAdviceDesc')}</p>
      </div>

      <div className={`${currentTheme.card} p-6 rounded-3xl shadow-sm space-y-4`}>
        <div className="relative">
          <textarea 
            rows={4} 
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder={t('symptomsPlaceholder')} 
            className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.bg} ${currentTheme.text} pr-12`} 
          />
          <button 
            onClick={handleAiAdvice}
            disabled={isAiLoading || !aiQuery.trim()}
            className={`absolute right-4 bottom-4 p-2 rounded-lg ${currentTheme.primary} text-white disabled:opacity-50`}
          >
            {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {aiResponse && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20`}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                <p className={`text-sm leading-relaxed ${currentTheme.text}`}>{aiResponse}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center space-y-2 pt-6">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600`}>
            <MessageSquare className="w-8 h-8" />
          </div>
        </div>
        <h2 className={`text-2xl font-bold ${currentTheme.text}`}>{t('humanExpert')}</h2>
        <p className={currentTheme.sub}>{t('humanExpertDesc')}</p>
      </div>

      <div className={`${currentTheme.card} p-6 rounded-3xl shadow-sm space-y-4`}>
        <div className="space-y-2">
          <label className={`text-sm font-bold ${currentTheme.text}`}>{t('fullName')}</label>
          <input type="text" defaultValue={userProfile.name} className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.bg} ${currentTheme.text}`} />
        </div>
        <div className="space-y-2">
          <label className={`text-sm font-bold ${currentTheme.text}`}>{t('carType')}</label>
          <input type="text" placeholder="Toyota Corolla 2020" className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.bg} ${currentTheme.text}`} />
        </div>
        <div className="space-y-2">
          <label className={`text-sm font-bold ${currentTheme.text}`}>{t('problemDesc')}</label>
          <textarea rows={4} placeholder="My car makes a weird noise when braking..." className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.bg} ${currentTheme.text}`} />
        </div>
        <div className="space-y-2">
          <label className={`text-sm font-bold ${currentTheme.text}`}>{t('phoneNumber')}</label>
          <input type="tel" placeholder="+212 600 000 000" className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.bg} ${currentTheme.text}`} />
        </div>
        <button 
          onClick={() => handleSubmission('advice')}
          className={`w-full p-4 rounded-xl ${currentTheme.primary} text-white font-bold shadow-lg`}
        >
          {t('sendRequest')}
        </button>
      </div>
    </motion.div>
  );

  const renderEmergency = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
      <div className="bg-red-600 rounded-3xl p-8 text-center text-white space-y-4 shadow-xl">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold">{t('emergencyHelp')}</h2>
        <p className="text-white/80">{t('emergencyDesc')}</p>
      </div>

      <div className={`${currentTheme.card} p-6 rounded-3xl shadow-sm space-y-4`}>
        <input type="text" placeholder={t('fullName')} className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.bg} ${currentTheme.text}`} />
        <input type="tel" placeholder={t('phoneNumber')} className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.bg} ${currentTheme.text}`} />
        <input type="text" placeholder={t('carType')} className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.bg} ${currentTheme.text}`} />
        <div className="relative">
          <input type="text" placeholder={t('yourLocation')} className={`w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${currentTheme.bg} ${currentTheme.text} pr-12`} />
          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 w-6 h-6" />
        </div>
        <button 
          onClick={() => handleSubmission('emergency')}
          className="w-full p-4 rounded-xl bg-red-600 text-white font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          {t('requestEmergencyHelp')}
        </button>
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
      <h2 className={`text-2xl font-bold ${currentTheme.text}`}>{t('settings')}</h2>

      <section className="space-y-4">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${currentTheme.sub}`}>{t('profile')}</h3>
        <div className={`${currentTheme.card} p-4 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-zinc-800`}>
          <div className={`w-12 h-12 rounded-full ${currentTheme.primary} flex items-center justify-center text-white`}>
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className={`font-bold ${currentTheme.text}`}>{userProfile.name}</p>
            <p className={`text-xs ${currentTheme.sub}`}>{userProfile.email}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${currentTheme.sub}`}>{t('appearance')}</h3>
        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1">
          {[
            { id: 'white-red', labelKey: 'themeWhiteRed', colors: ['bg-white', 'bg-red-600'] },
            { id: 'white-orange', labelKey: 'themeWhiteOrange', colors: ['bg-white', 'bg-orange-600'] },
            { id: 'white-blue', labelKey: 'themeWhiteBlue', colors: ['bg-white', 'bg-blue-600'] },
            { id: 'white-green', labelKey: 'themeWhiteGreen', colors: ['bg-white', 'bg-emerald-600'] },
            { id: 'white-purple', labelKey: 'themeWhitePurple', colors: ['bg-white', 'bg-purple-600'] },
            { id: 'black-red', labelKey: 'themeBlackRed', colors: ['bg-zinc-900', 'bg-red-600'] },
            { id: 'black-gold', labelKey: 'themeBlackGold', colors: ['bg-zinc-900', 'bg-amber-500'] },
            { id: 'black-blue', labelKey: 'themeBlackBlue', colors: ['bg-zinc-900', 'bg-blue-500'] },
            { id: 'black-green', labelKey: 'themeBlackGreen', colors: ['bg-zinc-900', 'bg-emerald-500'] },
            { id: 'black-orange', labelKey: 'themeBlackOrange', colors: ['bg-zinc-900', 'bg-orange-500'] },
            { id: 'black-purple', labelKey: 'themeBlackPurple', colors: ['bg-zinc-900', 'bg-purple-500'] },
          ].map((themeItem) => (
            <button
              key={themeItem.id}
              onClick={() => setTheme(themeItem.id as Theme)}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                theme === themeItem.id ? 'border-red-600' : 'border-transparent ' + currentTheme.card
              }`}
            >
              <div className="flex gap-1">
                {themeItem.colors.map((c, i) => <div key={i} className={`w-6 h-6 rounded-full border border-slate-200 dark:border-zinc-700 ${c}`} />)}
              </div>
              <span className={`text-[10px] font-bold ${currentTheme.text}`}>{t(themeItem.labelKey as any)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${currentTheme.sub}`}>{t('language')}</h3>
        <div className="flex gap-2">
          {[
            { id: 'en', label: 'English' },
            { id: 'fr', label: 'Français' },
            { id: 'ar', label: 'العربية' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id as Language)}
              className={`flex-1 p-3 rounded-xl border font-bold text-sm ${
                language === l.id ? 'bg-orange-600 border-orange-600 text-white' : `border-slate-200 dark:border-zinc-800 ${currentTheme.text}`
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <button className={`w-full p-4 rounded-2xl ${currentTheme.card} flex items-center justify-between ${currentTheme.text}`}>
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-orange-600" />
            <span className="font-bold">{t('maintenanceHistory')}</span>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>
        <button className={`w-full p-4 rounded-2xl ${currentTheme.card} flex items-center justify-between ${currentTheme.text}`}>
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-orange-600" />
            <span className="font-bold">{t('aboutApp')}</span>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>
    </motion.div>
  );

  return (
    <div className={`min-h-screen pb-24 ${currentTheme.bg} transition-colors duration-300`}>
      {isSubmitted && renderSuccessView()}
      <AnimatePresence>
        {showCheckout && renderCheckout()}
      </AnimatePresence>
      {renderHeader()}
      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && renderHome()}
          {currentPage === 'services' && renderServices()}
          {currentPage === 'shop' && renderShop()}
          {currentPage === 'advice' && renderAdvice()}
          {currentPage === 'emergency' && renderEmergency()}
          {currentPage === 'settings' && renderSettings()}
        </AnimatePresence>
      </main>
      {renderBottomNav()}
    </div>
  );
}
