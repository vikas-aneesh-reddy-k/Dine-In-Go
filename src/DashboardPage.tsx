import { useState, useEffect } from 'react';
import { Search, Menu, MapPin, Heart, X, Bell, Settings, Globe, ArrowLeft } from 'lucide-react';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Ensure the correct path to your firebase file

interface Restaurant {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
}

type Section = 'home' | 'bookings' | 'restaurants' | 'events' | 'favorites' | 'messages' | 'settings';

interface Translation {
  welcome: string;
  exploreRestaurants: string;
  exploreEvents: string;
  home: string;
  bookings: string;
  restaurants: string;
  events: string;
  favourites: string;
  messages: string;
  settings: string;
  logout: string;
  lightMode: string;
  darkMode: string;
  upcomingEvents: string;
  eventsDescription: string;
  welcomeMessage: string;
  discoverMessage: string;
  searchPlaceholder: string;
  language: string;
  noFavorites: string;
  addFavorites: string;
  noBookings: string;
  bookingsMessage: string;
  unreadMessages: string;
  allRightsReserved: string;
}

interface Translations {
  [key: string]: Translation;
}

export default function DineInGoDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "50% off at The Pump House this weekend!", read: false },
    { id: 2, message: "New restaurant 'Spice Bazaar' now open near you", read: false },
    { id: 3, message: "Your reservation at 1947 is confirmed", read: true }
  ]);
  const [language, setLanguage] = useState('english');
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);

  // Translations
  const translations: Translations = {
    english: {
      welcome: "Welcome, Stephen!",
      exploreRestaurants: "Explore Restaurants",
      exploreEvents: "Explore Events",
      home: "Home",
      bookings: "Bookings",
      restaurants: "Restaurants",
      events: "Events",
      favourites: "Favourites",
      messages: "Messages",
      settings: "Settings",
      logout: "Logout",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      upcomingEvents: "Upcoming Events",
      eventsDescription: "Food festivals, cooking workshops, and more coming soon!",
      welcomeMessage: "Welcome to DineInGo!",
      discoverMessage: "Discover the best restaurants and events in your area by using the 'Explore' buttons above.",
      searchPlaceholder: "search for Restaurants & Events",
      language: "Language",
      noFavorites: "No favorites yet",
      addFavorites: "Heart your favorite restaurants to see them here!",
      noBookings: "No bookings yet",
      bookingsMessage: "Your restaurant reservations will appear here",
      unreadMessages: "unread messages",
      allRightsReserved: "©DineInGo2025. All Rights Reserved"
    },
    hindi: {
      welcome: "स्वागत है, Stephen!",
      exploreRestaurants: "रेस्तरां खोजें",
      exploreEvents: "कार्यक्रम खोजें",
      home: "होम",
      bookings: "बुकिंग",
      restaurants: "रेस्तरां",
      events: "कार्यक्रम",
      favourites: "पसंदीदा",
      messages: "संदेश",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      lightMode: "लाइट मोड",
      darkMode: "डार्क मोड",
      upcomingEvents: "आगामी कार्यक्रम",
      eventsDescription: "फूड फेस्टिवल, कुकिंग वर्कशॉप और भी बहुत कुछ जल्द आ रहा है!",
      welcomeMessage: "DineInGo में आपका स्वागत है!",
      discoverMessage: "ऊपर दिए गए 'एक्सप्लोर' बटन का उपयोग करके अपने क्षेत्र के सर्वश्रेष्ठ रेस्तरां और कार्यक्रम खोजें।",
      searchPlaceholder: "रेस्तरां और कार्यक्रम खोजें",
      language: "भाषा",
      noFavorites: "अभी तक कोई पसंदीदा नहीं",
      addFavorites: "अपने पसंदीदा रेस्तरां को हार्ट करें!",
      noBookings: "अभी तक कोई बुकिंग नहीं",
      bookingsMessage: "आपके रेस्तरां आरक्षण यहां दिखाई देंगे",
      unreadMessages: "अपठित संदेश",
      allRightsReserved: "©DineInGo2025. सर्वाधिकार सुरक्षित"
    },
    tamil: {
      welcome: "வரவேற்கிறோம், Stephen!",
      exploreRestaurants: "உணவகங்களை ஆராயுங்கள்",
      exploreEvents: "நிகழ்வுகளை ஆராயுங்கள்",
      home: "முகப்பு",
      bookings: "முன்பதிவுகள்",
      restaurants: "உணவகங்கள்",
      events: "நிகழ்வுகள்",
      favourites: "பிடித்தவை",
      messages: "செய்திகள்",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",
      lightMode: "ஒளி பயன்முறை",
      darkMode: "இருள் பயன்முறை",
      upcomingEvents: "வரவிருக்கும் நிகழ்வுகள்",
      eventsDescription: "உணவு விழாக்கள், சமையல் பட்டறைகள் மற்றும் பல விரைவில் வருகின்றன!",
      welcomeMessage: "DineInGo-க்கு வரவேற்கிறோம்!",
      discoverMessage: "மேலே உள்ள 'ஆராய்' பொத்தான்களைப் பயன்படுத்தி உங்கள் பகுதியில் சிறந்த உணவகங்கள் மற்றும் நிகழ்வுகளைக் கண்டறியுங்கள்.",
      searchPlaceholder: "உணவகங்கள் & நிகழ்வுகளை தேடுங்கள்",
      language: "மொழி",
      noFavorites: "இதுவரை பிடித்தவை இல்லை",
      addFavorites: "உங்களுக்கு பிடித்த உணவகங்களை இங்கே காண இதயத்தை கிளிக் செய்யுங்கள்!",
      noBookings: "இதுவரை முன்பதிவுகள் இல்லை",
      bookingsMessage: "உங்கள் உணவக முன்பதிவுகள் இங்கே தோன்றும்",
      unreadMessages: "படிக்காத செய்திகள்",
      allRightsReserved: "©DineInGo2025. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை"
    },
    kannada: {
      welcome: "ಸ್ವಾಗತ, Stephen!",
      exploreRestaurants: "ಉಪಹಾರ ಗೃಹಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
      exploreEvents: "ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
      home: "ಮನೆ",
      bookings: "ಬುಕಿಂಗ್‌ಗಳು",
      restaurants: "ಉಪಹಾರ ಗೃಹಗಳು",
      events: "ಕಾರ್ಯಕ್ರಮಗಳು",
      favourites: "ಮೆಚ್ಚಿನವುಗಳು",
      messages: "ಸಂದೇಶಗಳು",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      logout: "ಲಾಗ್ ಔಟ್",
      lightMode: "ಲೈಟ್ ಮೋಡ್",
      darkMode: "ಡಾರ್ಕ್ ಮೋಡ್",
      upcomingEvents: "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು",
      eventsDescription: "ಆಹಾರ ಉತ್ಸವಗಳು, ಅಡುಗೆ ಕಾರ್ಯಾಗಾರಗಳು ಮತ್ತು ಇನ್ನಷ್ಟು ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿವೆ!",
      welcomeMessage: "DineInGo ಗೆ ಸ್ವಾಗತ!",
      discoverMessage: "ಮೇಲಿನ 'ಅನ್ವೇಷಿಸಿ' ಬಟನ್‌ಗಳನ್ನು ಬಳಸಿಕೊಂಡು ನಿಮ್ಮ ಪ್ರದೇಶದ ಅತ್ಯುತ್ತಮ ಉಪಹಾರ ಗೃಹಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.",
      searchPlaceholder: "ಉಪಹಾರ ಗೃಹಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಹುಡುಕಿ",
      language: "ಭಾಷೆ",
      noFavorites: "ಇನ್ನೂ ಮೆಚ್ಚಿನವುಗಳಿಲ್ಲ",
      addFavorites: "ನಿಮ್ಮ ಮೆಚ್ಚಿನ ಉಪಹಾರ ಗೃಹಗಳನ್ನು ಇಲ್ಲಿ ನೋಡಲು ಹೃದಯವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ!",
      noBookings: "ಇನ್ನೂ ಬುಕಿಂಗ್‌ಗಳಿಲ್ಲ",
      bookingsMessage: "ನಿಮ್ಮ ಉಪಹಾರ ಗೃಹ ಬುಕಿಂಗ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ",
      unreadMessages: "ಓದದ ಸಂದೇಶಗಳು",
      allRightsReserved: "©DineInGo2025. ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ"
    },
    telugu: {
      welcome: "స్వాగతం, Stephen!",
      exploreRestaurants: "రెస్టారెంట్లను అన్వేషించండి",
      exploreEvents: "ఈవెంట్లను అన్వేషించండి",
      home: "హోమ్",
      bookings: "బుకింగ్స్",
      restaurants: "రెస్టారెంట్లు",
      events: "ఈవెంట్లు",
      favourites: "ఇష్టమైనవి",
      messages: "సందೇశాలు",
      settings: "సెట్టింగ్స్",
      logout: "లాగ్ అవుట్",
      lightMode: "లైట్ మోడ్",
      darkMode: "డార్క్ మోడ్",
      upcomingEvents: "రాబోయే ఈవెంట్లు",
      eventsDescription: "ఫుడ్ ఫెస్టివల్స్, కుకింగ్ వర్క్‌షాప్స్ మరియు మరిన్ని త్వరలో వస్తున్నాయి!",
      welcomeMessage: "DineInGo కి స్వాగతం!",
      discoverMessage: "పై 'ఎక్స్‌ప్లోర్' బటన్‌లను ఉపయోగించి మీ ప్రాంతంలోని ఉత్తమ రెస్టారెంట్లు మరియు ఈవెంట్లను కనుగొనండి.",
      searchPlaceholder: "రెస్టారెంట్లు & ఈవెంట్లను శోధించండి",
      language: "భాష",
      noFavorites: "ఇంకా ఇష్టమైనవి లేవు",
      addFavorites: "మీకు ఇష్టమైన రెస్టారెంట్లను ఇక్కడ చూడటానికి హೃదయాన್ని క్లిక్ చేయండి!",
      noBookings: "ఇంకా బుకింగ్స్ లేవు",
      bookingsMessage: "మీ రెస్టారెంట్ బుకింగ్స్ ఇక్కడ కనిపిస్తాయి",
      unreadMessages: "చదవని సందೇశాలు",
      allRightsReserved: "©DineInGo2025. అన్ని హక್కులు రిజర్వ్ చేయబడ్డాయి"
    }
  };

  const t = translations[language];

  // Available Indian languages
  const availableLanguages = [
    { code: 'english', name: 'English' },
    { code: 'hindi', name: 'हिन्दी (Hindi)' },
    { code: 'tamil', name: 'தமிழ் (Tamil)' },
    { code: 'kannada', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'telugu', name: 'తెలుగు (Telugu)' }
  ];

  // Sample restaurant data
  const restaurantData = [
    {
      id: "1",
      name: "1947",
      location: "JP Nagar, Bangalore",
      rating: 4.8,
      image: "/api/placeholder/400/200"
    },
    {
      id: "2",
      name: "The Pump House",
      location: "JP Nagar, Bangalore",
      rating: 4.8,
      image: "/api/placeholder/400/200"
    },
    {
      id: "3",
      name: "K&D London",
      location: "9A Devonshire Square, England",
      rating: 4.8,
      image: "/api/placeholder/400/200"
    },
    {
      id: "4",
      name: "Ormer Mayfair",
      location: "7-12 Half Moon Street Flemings, England",
      rating: 4.9,
      image: "/api/placeholder/400/200"
    },
    {
      id: "5",
      name: "The White Room",
      location: "MG Road, Bangalore",
      rating: 4.7,
      image: "/api/placeholder/400/200"
    },
    {
      id: "6",
      name: "Meghana Foods",
      location: "JP Nagar, Bangalore",
      rating: 4.6,
      image: "/api/placeholder/400/200"
    }
  ];

  // Sample bookings data
  const bookingsData = [
    {
      id: "1",
      restaurantName: "1947",
      date: "April 15, 2025",
      time: "7:30 PM",
      guests: 2,
      status: "Confirmed"
    },
    {
      id: "2",
      restaurantName: "The White Room",
      date: "April 20, 2025",
      time: "8:00 PM",
      guests: 4,
      status: "Pending"
    }
  ];

  // Load saved favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('dineInGoFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    const savedLanguage = localStorage.getItem('dineInGoLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dineInGoFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('dineInGoLanguage', language);
  }, [language]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (section: Section) => {
    setActiveSection(section);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const toggleFavorite = (restaurant: Restaurant) => {
    const isAlreadyFavorite = favorites.some(fav => fav.id === restaurant.id);
    
    if (isAlreadyFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== restaurant.id));
    } else {
      setFavorites([...favorites, restaurant]);
    }
  };

  const isRestaurantFavorite = (restaurantId: string) => {
    return favorites.some(fav => fav.id === restaurantId);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    setShowLanguageSettings(false);
  };

  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex">
        {/* Sidebar - Conditionally shown */}
        {isSidebarOpen && (
          <div className={`w-64 p-4 fixed h-full z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold relative">
                  D<span className="relative">i<span className="absolute -top-2.5 -right-0.5 text-red-500 text-2.5xl">•</span></span>neIn<span className="text-yellow-400">Go</span>
                </div>
              </div>
              <button onClick={toggleSidebar} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                  <img src="/api/placeholder/48/48" alt="profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Stephen</h3>
                  <p className="text-gray-500 text-sm">stephen@example.com</p>
                </div>
              </div>
            </div>
            
            <nav>
              <ul className="space-y-4">
                <li 
                  className={`p-2 rounded cursor-pointer ${activeSection === 'home' ? 'bg-emerald-400 text-black' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={() => handleNavigation('home')}
                >
                  {t.home}
                </li>
                <li 
                  className={`p-2 rounded cursor-pointer ${activeSection === 'bookings' ? 'bg-emerald-400 text-black' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={() => handleNavigation('bookings')}
                >
                  {t.bookings}
                </li>
                <li 
                  className={`p-2 rounded cursor-pointer ${activeSection === 'restaurants' ? 'bg-emerald-400 text-black' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={() => handleNavigation('restaurants')}
                >
                  {t.restaurants}
                </li>
                <li 
                  className={`p-2 rounded cursor-pointer ${activeSection === 'events' ? 'bg-emerald-400 text-black' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={() => handleNavigation('events')}
                >
                  {t.events}
                </li>
                <li 
                  className={`p-2 rounded cursor-pointer ${activeSection === 'favorites' ? 'bg-emerald-400 text-black' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={() => handleNavigation('favorites')}
                >
                  {t.favourites}
                </li>
                <li 
                  className={`p-2 rounded cursor-pointer ${activeSection === 'messages' ? 'bg-emerald-400 text-black' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex justify-between items-center`}
                  onClick={() => handleNavigation('messages')}
                >
                  <span>{t.messages}</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </li>
                <li 
                  className={`p-2 rounded cursor-pointer ${activeSection === 'settings' ? 'bg-emerald-400 text-black' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={() => handleNavigation('settings')}
                >
                  {t.settings}
                </li>
                <li 
                  className={`p-2 rounded cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={handleLogout}
                >
                  {t.logout}
                </li>
              </ul>
            </nav>
            
            <div className="mt-8 flex items-center">
              <span className={`mr-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {isDarkMode ? t.darkMode : t.lightMode}
              </span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  id="toggle"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                />
                <label 
                  htmlFor="toggle" 
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${isDarkMode ? 'bg-green-400' : 'bg-gray-300'}`}
                >
                  <span className={`dot block w-5 h-5 mt-0.5 ml-0.5 rounded-full transition-transform duration-300 ease-in-out ${isDarkMode ? 'transform translate-x-4 bg-white' : 'bg-white'}`}></span>
                </label>
              </div>
              {isDarkMode ? 
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg> : 
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`flex-1 relative ${isSidebarOpen ? 'ml-64' : ''}`}>
          {/* Doodle Art Illustrations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-25">
            {/* Fork and knife doodle */}
            <div className="absolute top-40 left-10">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="1">
                <path d="M30,10 L30,80 M30,75 C30,85 40,85 40,75 L40,50 M20,10 L20,30 M25,10 L25,30 M35,10 L35,30" />
                <path d="M70,10 C80,30 80,50 70,60 C60,70 60,90 70,90" />
              </svg>
            </div>
            
            {/* Plate doodle */}
            <div className="absolute bottom-40 right-20">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="black" strokeWidth="1">
                <ellipse cx="60" cy="60" rx="50" ry="30" />
                <ellipse cx="60" cy="60" rx="40" ry="20" />
              </svg>
            </div>
            
            {/* Coffee cup doodle */}
            <div className="absolute top-60 right-40">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="1">
                <path d="M20,30 L20,70 C20,80 40,80 40,70 L40,30 z" />
                <path d="M40,40 C60,40 60,60 40,60" />
                <ellipse cx="30" cy="20" rx="15" ry="5" />
              </svg>
            </div>
            
            {/* Chef hat doodle */}
            <div className="absolute top-20 right-10">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="1">
                <path d="M30,80 C10,80 10,40 30,40 C30,20 70,20 70,40 C90,40 90,80 70,80 z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <header className="bg-emerald-400 p-4 flex justify-between items-center rounded-3xl mx-4 my-4">
            <div className="flex items-center">
              {!isSidebarOpen && (
                <button onClick={toggleSidebar} className="mr-4">
                  <Menu className="text-black" />
                </button>
              )}
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => setActiveSection('home')}
              >
                <div className="text-2xl font-bold relative">
                  D<span className="relative">i<span className="absolute -top-2.5 -right-0.5 text-red-500 text-2.5xl">•</span></span>neIn<span className="text-yellow-400">Go</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative mr-4 flex items-center">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="bg-gray-200 text-sm py-2 px-4 pr-10 rounded-full w-64"
                />
                <button className="absolute right-2">
                  <Search className="text-gray-500" size={18} />
                </button>
              </div>
              <div
                className="relative mr-4 cursor-pointer"
                onClick={() => handleNavigation('messages')}
              >
                <Bell size={22} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </div>
              <div 
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => handleNavigation('settings')}
              >
                <img src="/api/placeholder/40/40" alt="profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6 relative z-1">
            {activeSection !== 'settings' && activeSection !== 'favorites' && 
             activeSection !== 'bookings' && activeSection !== 'messages' && (
              <div className="flex items-center mb-8">
                <h1 className="text-2xl font-bold mr-2">{t.welcome}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={16} className="mr-1" />
                  <span>location/pincode</span>
                </div>
              </div>
            )}

            {/* Home Section */}
            {activeSection === 'home' && (
              <>
                {/* Explore Buttons */}
                <div className="flex justify-between mb-10 gap-4">
                  <button 
                    className={`text-black px-8 py-3 rounded-full font-semibold flex-1 ${activeSection === 'restaurants' ? 'bg-green-500' : 'bg-green-400'}`}
                    onClick={() => handleNavigation('restaurants')}
                  >
                    {t.exploreRestaurants}
                  </button>
                  <button 
                    className={`text-black px-8 py-3 rounded-full font-semibold flex-1 ${activeSection === 'events' ? 'bg-green-500' : 'bg-green-400'}`}
                    onClick={() => handleNavigation('events')}
                  >
                    {t.exploreEvents}
                  </button>
                </div>

                {/* Welcome Content */}
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="mb-6 w-32 h-32">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M50,20 C30,20 20,40 20,50 C20,70 40,80 50,80 C70,80 80,60 80,50 C80,30 70,20 50,20 z" />
                      <path d="M30,40 C40,30 60,30 70,40" />
                      <circle cx="40" cy="50" r="5" />
                      <circle cx="60" cy="50" r="5" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{t.welcomeMessage}</h2>
                  <p className="text-gray-500 text-center max-w-md">
                    {t.discoverMessage}
                  </p>
                </div>
              </>
            )}

            {/* Restaurant Listings */}
            {activeSection === 'restaurants' && (
              <>
                {/* Restaurant Grid - First Row */}
                <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
                  {restaurantData.slice(0, 3).map(restaurant => (
                    <div key={restaurant.id} className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex-none w-72`}>
                      <div className="relative">
                        <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover rounded-t-lg" />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white rounded-full px-2 py-1 flex items-center">
                          <svg className="w-4 h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {restaurant.rating}
                        </div>
                        <button 
                          className={`absolute bottom-2 right-2 p-2 rounded-full ${isRestaurantFavorite(restaurant.id) ? 'bg-red-500' : 'bg-green-400'}`}
                          onClick={() => toggleFavorite(restaurant)}
                        >
                          <Heart size={16} className="text-white" fill={isRestaurantFavorite(restaurant.id) ? "white" : "none"} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin size={14} className="mr-1" />
                          <span>{restaurant.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Restaurant Grid - Second Row */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {restaurantData.slice(3).map(restaurant => (
                    <div key={restaurant.id} className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex-none w-72`}>
                      <div className="relative">
                        <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover rounded-t-lg" />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white rounded-full px-2 py-1 flex items-center">
                          <svg className="w-4 h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {restaurant.rating}
                        </div>
                        <button 
                          className={`absolute bottom-2 right-2 p-2 rounded-full ${isRestaurantFavorite(restaurant.id) ? 'bg-red-500' : 'bg-green-400'}`}
                          onClick={() => toggleFavorite(restaurant)}
                        >
                          <Heart size={16} className="text-white" fill={isRestaurantFavorite(restaurant.id) ? "white" : "none"} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin size={14} className="mr-1" />
                          <span>{restaurant.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Events Section */}
            {activeSection === 'events' && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t.upcomingEvents}</h2>
                <p className="text-gray-500 mb-6">{t.eventsDescription}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Card 1 */}
                  <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                    <div className="relative">
                      <img src="/api/placeholder/600/300" alt="Food Festival" className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2 bg-green-400 text-black font-bold rounded-full px-3 py-1">
                        APR 25
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg">Bangalore Food Festival</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin size={14} className="mr-1" />
                        <span>Palace Grounds, Bangalore</span>
                      </div>
                      <p className="text-sm text-gray-500">Experience culinary delights from across India at this grand food festival.</p>
                    </div>
                  </div>
                  
                  {/* Event Card 2 */}
                  <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                    <div className="relative">
                      <img src="/api/placeholder/600/300" alt="Cooking Workshop" className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2 bg-green-400 text-black font-bold rounded-full px-3 py-1">
                        MAY 10
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg">Italian Cooking Workshop</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin size={14} className="mr-1" />
                        <span>Culinary Academy, Indiranagar</span>
                      </div>
                      <p className="text-sm text-gray-500">Learn to make authentic Italian dishes from renowned Chef Mario Rossi.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Section */}
            {activeSection === 'favorites' && (
              <div>
                <div className="flex items-center mb-6">
                  <ArrowLeft 
                    size={20} 
                    className="mr-2 cursor-pointer" 
                    onClick={() => handleNavigation('home')}
                  />
                  <h2 className="text-xl font-semibold">{t.favourites}</h2>
                </div>
                
                {favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="mb-6 w-24 h-24">
                      <Heart size={96} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t.noFavorites}</h3>
                    <p className="text-gray-500 text-center">
                      {t.addFavorites}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map(restaurant => (
                      <div key={restaurant.id} className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                        <div className="relative">
                          <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white rounded-full px-2 py-1 flex items-center">
                            <svg className="w-4 h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {restaurant.rating}
                          </div>
                          <button 
                            className="absolute bottom-2 right-2 p-2 rounded-full bg-red-500"
                            onClick={() => toggleFavorite(restaurant)}
                          >
                            <Heart size={16} className="text-white" fill="white" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg">{restaurant.name}</h3>
                          <div className="flex items-center text-gray-500 text-sm">
                            <MapPin size={14} className="mr-1" />
                            <span>{restaurant.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Section */}
            {activeSection === 'bookings' && (
              <div>
                <div className="flex items-center mb-6">
                  <ArrowLeft 
                    size={20} 
                    className="mr-2 cursor-pointer" 
                    onClick={() => handleNavigation('home')}
                  />
                  <h2 className="text-xl font-semibold">{t.bookings}</h2>
                </div>
                
                {bookingsData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="mb-6 w-24 h-24">
                      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full text-gray-300" strokeWidth="1">
                        <rect x="20" y="30" width="60" height="50" rx="5" />
                        <path d="M30,30 L30,20 L70,20 L70,30" />
                        <line x1="20" y1="45" x2="80" y2="45" />
                        <line x1="35" y1="60" x2="65" y2="60" />
                        <line x1="35" y1="70" x2="55" y2="70" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t.noBookings}</h3>
                    <p className="text-gray-500 text-center">
                      {t.bookingsMessage}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookingsData.map(booking => (
                      <div 
                        key={booking.id} 
                        className={`p-4 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
                      >
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-lg bg-gray-200 mr-4 flex items-center justify-center overflow-hidden">
                            <img src="/api/placeholder/64/64" alt={booking.restaurantName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-bold">{booking.restaurantName}</h3>
                            <div className="flex items-center text-gray-500 text-sm">
                              <span className="mr-4">{booking.date} • {booking.time}</span>
                              <span>{booking.guests} guests</span>
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {booking.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages & Notifications Section */}
            {activeSection === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <ArrowLeft 
                      size={20} 
                      className="mr-2 cursor-pointer" 
                      onClick={() => handleNavigation('home')}
                    />
                    <h2 className="text-xl font-semibold">{t.messages}</h2>
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button 
                      className="text-sm text-green-500 hover:underline"
                      onClick={markAllNotificationsAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="mb-6 w-24 h-24">
                      <Bell size={96} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No messages</h3>
                    <p className="text-gray-500 text-center">
                      You don't have any notifications at the moment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-lg ${notification.read ? '' : 'border-l-4 border-green-400'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
                      >
                        <p className={notification.read ? 'text-gray-500' : 'font-medium'}>
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div>
                <div className="flex items-center mb-6">
                  <ArrowLeft 
                    size={20} 
                    className="mr-2 cursor-pointer" 
                    onClick={() => handleNavigation('home')}
                  />
                  <h2 className="text-xl font-semibold">{t.settings}</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Profile Settings */}
                  <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                    <h3 className="font-bold text-lg mb-4">Profile</h3>
                    <div className="flex items-center">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-6">
                        <img src="/api/placeholder/80/80" alt="profile" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Stephen</h4>
                        <p className="text-gray-500 text-sm">stephen@example.com</p>
                        <button className="mt-2 text-green-500 text-sm">Change profile picture</button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Appearance Settings */}
                  <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                    <h3 className="font-bold text-lg mb-4">Appearance</h3>
                    <div className="flex items-center">
                      <span className="mr-4">{isDarkMode ? t.darkMode : t.lightMode}</span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          className="sr-only"
                          id="toggleAppearance"
                          checked={isDarkMode}
                          onChange={toggleDarkMode}
                        />
                        <label 
                          htmlFor="toggleAppearance" 
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${isDarkMode ? 'bg-green-400' : 'bg-gray-300'}`}
                        >
                          <span className={`dot block w-5 h-5 mt-0.5 ml-0.5 rounded-full transition-transform duration-300 ease-in-out ${isDarkMode ? 'transform translate-x-4 bg-white' : 'bg-white'}`}></span>
                        </label>
                      </div>
                      {isDarkMode ? 
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg> : 
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      }
                    </div>
                  </div>
                  
                  {/* Language Settings */}
                  <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                    <h3 className="font-bold text-lg mb-4">{t.language}</h3>
                    <div className="relative">
                      <button 
                        className="flex items-center justify-between w-full px-4 py-2 border rounded-lg"
                        onClick={() => setShowLanguageSettings(!showLanguageSettings)}
                      >
                        <div className="flex items-center">
                          <Globe size={16} className="mr-2" />
                          <span>{availableLanguages.find(lang => lang.code === language)?.name || 'English'}</span>
                        </div>
                        <svg className={`w-5 h-5 transition-transform ${showLanguageSettings ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {showLanguageSettings && (
                        <div className={`absolute w-full mt-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border shadow-lg z-10`}>
                          {availableLanguages.map(lang => (
                            <button
                              key={lang.code}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-600' : ''} ${lang.code === language ? 'bg-green-100 text-green-800' : ''}`}
                              onClick={() => handleLanguageChange(lang.code)}
                            >
                              {lang.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="p-6 text-center text-gray-500 text-sm">
              © DineInGo 2025, All Rights Reserved
          </footer>
        </div>
      </div>
    </div>
  );
}