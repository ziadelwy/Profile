# Personal Portfolio Website

A modern, responsive personal portfolio website built with HTML, CSS, and JavaScript. Features a clean design, dark/light theme toggle, and comprehensive portfolio management through an admin dashboard.

## ✨ Features

### 🎨 **Portfolio Display**
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Dark/Light Theme**: Toggle between themes with persistent preference storage
- **Smooth Animations**: CSS transitions and hover effects for enhanced UX
- **Progress Indicator**: Visual progress bar showing page scroll position

### 🛠️ **Portfolio Management**
- **Skills Section**: Display technical skills with ratings and categories
- **Projects Showcase**: Feature projects with descriptions, tech stacks, and links
- **Work Experience**: Professional background with detailed job information
- **Contact Information**: Multiple social media and communication platforms

### 🔧 **Admin Dashboard**
- **Content Management**: Edit all portfolio content through an intuitive interface
- **Real-time Updates**: Changes reflect immediately across the website
- **Data Import/Export**: Backup and restore portfolio data
- **Responsive Admin UI**: Mobile-friendly administration panel

### ☁️ **Firebase Integration** (NEW!)
- **Cloud Storage**: Store all portfolio data in Firebase Firestore
- **Real-time Sync**: Changes sync instantly across all devices
- **Data Persistence**: No more localStorage limitations
- **Scalable Backend**: Professional-grade database infrastructure

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)
- Firebase account (for cloud storage)

### Installation

1. **Clone or Download** the project files
2. **Set up Firebase** (see [Firebase Setup Guide](FIREBASE_SETUP.md))
3. **Update Configuration** in `firebase-config.js` with your Firebase credentials
4. **Start Local Server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
5. **Open** `http://localhost:8000` in your browser

## 📁 Project Structure

```
portfolio-website/
├── index.html              # Main portfolio page
├── admin.html              # Admin dashboard
├── styles.css              # Main stylesheet
├── admin-styles.css        # Admin dashboard styles
├── script.js               # Main portfolio functionality
├── admin.js                # Admin dashboard functionality
├── firebase-config.js      # Firebase configuration & database functions
├── firebase-test.html      # Firebase connection test page
├── FIREBASE_SETUP.md       # Firebase setup guide
└── README.md               # This file
```

## 🔥 Firebase Setup

The portfolio now uses Firebase Firestore for data storage instead of localStorage. This provides:

- **Cloud Storage**: Data persists across devices and browsers
- **Real-time Updates**: Changes sync instantly
- **Professional Backend**: Scalable and reliable database
- **Cross-platform Access**: Manage data from anywhere

### Quick Setup:
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Get your project configuration
4. Update `firebase-config.js` with your credentials
5. Test connection using `firebase-test.html`

For detailed setup instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

## 🎯 Usage

### **Portfolio View**
- Navigate through sections using the progress bar
- Toggle between light and dark themes
- View skills, projects, and work experience
- Access contact information and social links

### **Admin Dashboard**
- Access via the "Admin" button in the header
- Edit personal information, skills, projects, and jobs
- Import/export portfolio data
- Reset to default values if needed

### **Content Management**
- **Skills**: Add, edit, or remove technical skills with ratings
- **Projects**: Manage project details, descriptions, and links
- **Experience**: Update work history and professional background
- **Personal Info**: Modify name, specializations, and about text

## 🎨 Customization

### **Styling**
- Modify `styles.css` for main portfolio appearance
- Edit `admin-styles.css` for admin dashboard styling
- Update color schemes and typography in CSS variables

### **Content**
- Edit portfolio data through the admin dashboard
- Modify default data in `firebase-config.js`
- Update contact links and social media information

### **Functionality**
- Extend features in `script.js` and `admin.js`
- Add new sections or modify existing ones
- Implement additional Firebase features

## 🌐 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## 🔧 Development

### **Local Development**
1. Set up a local web server
2. Configure Firebase for development
3. Use `firebase-test.html` to verify connectivity
4. Test all functionality before deployment

### **Testing Firebase**
- Open `firebase-test.html` in your browser
- Run connection tests to verify setup
- Test read/write operations
- Verify portfolio data management

### **Debugging**
- Check browser console for error messages
- Verify Firebase configuration
- Test network connectivity
- Review Firestore security rules

## 📱 Responsive Design

The portfolio is fully responsive and works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly mobile interface
- **All Devices**: Consistent functionality across platforms

## 🚀 Deployment

### **Firebase Hosting** (Recommended)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### **Other Hosting Options**
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for public repositories
- **Traditional Hosting**: Upload files to any web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter issues:
- Check the [Firebase Setup Guide](FIREBASE_SETUP.md)
- Review browser console for error messages
- Verify Firebase configuration
- Test with `firebase-test.html`

## 🔮 Future Enhancements

- [ ] User authentication for admin access
- [ ] Image upload and management
- [ ] Blog/Articles section
- [ ] Contact form with email integration
- [ ] Analytics and visitor tracking
- [ ] Multi-language support
- [ ] Advanced animations and interactions

---

**Built with ❤️ using HTML, CSS, JavaScript, and Firebase** 