// Firebase Configuration and Database Functions

// Import Firebase modules (you'll need to add these CDN links to your HTML files)
// Firebase SDK will be loaded via CDN

// Initialize Firebase with your actual configuration
const firebaseConfig = {
    apiKey: "AIzaSyCW3HVas43YKjVpSnTOF7X3E3miIvfI91Y",
    authDomain: "portfolio-c5195.firebaseapp.com",
    projectId: "portfolio-c5195",
    storageBucket: "portfolio-c5195.firebasestorage.app",
    messagingSenderId: "851812182764",
    appId: "1:851812182764:web:8f29b9e21524d14eb093c9",
    measurementId: "G-MKL59JD54B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore database reference
const db = firebase.firestore();

// Portfolio Data Management Class
class FirebasePortfolioManager {
    constructor() {
        this.db = db;
        this.collectionName = 'portfolioData';
        this.documentId = 'mainPortfolio'; // Single document for all portfolio data
    }

    // Save all portfolio data to Firebase
    async savePortfolioData(data) {
        try {
            await this.db.collection(this.collectionName).doc(this.documentId).set(data);
            return true;
        } catch (error) {
            console.error('Error saving portfolio data to Firebase:', error);
            throw error;
        }
    }

    // Load portfolio data from Firebase
    async loadPortfolioData() {
        try {
            const doc = await this.db.collection(this.collectionName).doc(this.documentId).get();
            
            if (doc.exists) {
                const data = doc.data();
                return data;
            } else {
                return this.getDefaultPortfolioData();
            }
        } catch (error) {
            console.error('Error loading portfolio data from Firebase:', error);
            return this.getDefaultPortfolioData();
        }
    }

    // Get default portfolio data structure
    getDefaultPortfolioData() {
        return {
            name: 'Your Name',
            specializations: ['Web Developer', 'UI/UX Designer', 'Software Engineer'],
            about: 'I am a passionate and dedicated professional with expertise in web development, design, and software engineering. I love creating innovative solutions and bringing ideas to life through technology. With years of experience in the field, I have developed a strong foundation in both frontend and backend development, along with a keen eye for user experience design.',
            skills: [
                { name: 'HTML/CSS', rating: 5, category: 'frontend' },
                { name: 'JavaScript', rating: 4, category: 'frontend' },
                { name: 'React', rating: 4, category: 'frontend' },
                { name: 'Node.js', rating: 3, category: 'backend' },
                { name: 'Python', rating: 4, category: 'backend' },
                { name: 'UI/UX Design', rating: 4, category: 'design' },
                { name: 'Git', rating: 5, category: 'tools' },
                { name: 'Docker', rating: 3, category: 'tools' }
            ],
            projects: [
                {
                    title: 'E-Commerce Platform',
                    description: 'A full-stack e-commerce application built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.',
                    image: '🛒',
                    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                    liveUrl: 'https://example.com',
                    githubUrl: 'https://github.com/example'
                },
                {
                    title: 'Task Management App',
                    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
                    image: '📋',
                    tech: ['Vue.js', 'Firebase', 'Tailwind CSS'],
                    liveUrl: 'https://example.com',
                    githubUrl: 'https://github.com/example'
                },
                {
                    title: 'Portfolio Website',
                    description: 'A modern, responsive portfolio website built with vanilla JavaScript and CSS. Features smooth animations and interactive elements.',
                    image: '🎨',
                    tech: ['HTML5', 'CSS3', 'JavaScript'],
                    liveUrl: 'https://example.com',
                    githubUrl: 'https://github.com/example'
                }
            ],
            jobs: [
                {
                    title: 'Senior Web Developer',
                    company: 'Tech Solutions Inc.',
                    type: 'Full-time',
                    duration: 'Jan 2023 - Present',
                    location: 'New York, NY',
                    siteType: 'Hybrid',
                    status: 'Current',
                    socialMedia: 'https://techsolutions.com',
                    description: 'Leading development of modern web applications using React, Node.js, and cloud technologies. Managing a team of 5 developers and implementing best practices for code quality and performance.'
                },
                {
                    title: 'Frontend Developer',
                    company: 'Digital Creations',
                    type: 'Full-time',
                    duration: 'Mar 2021 - Dec 2022',
                    location: 'San Francisco, CA',
                    siteType: 'Remote',
                    status: 'Previous',
                    socialMedia: 'https://digitalcreations.com',
                    description: 'Developed responsive web applications and improved user experience. Collaborated with design and backend teams to deliver high-quality products.'
                }
            ],
            contactLinks: {
                github: 'https://github.com/yourusername',
                linkedin: 'https://linkedin.com/in/yourusername',
                facebook: 'https://facebook.com/yourusername',
                whatsapp: '+1234567890',
                discord: 'username#1234',
                telegram: '@username',
                email: 'your.email@example.com',
                phone: '+1234567890'
            },

        };
    }

    // Save specific section data
    async saveSection(sectionName, sectionData) {
        try {
            const currentData = await this.loadPortfolioData();
            currentData[sectionName] = sectionData;
            await this.savePortfolioData(currentData);
            return true;
        } catch (error) {
            console.error(`Error saving ${sectionName} section:`, error);
            throw error;
        }
    }

    // Update specific field
    async updateField(fieldName, value) {
        try {
            const currentData = await this.loadPortfolioData();
            currentData[fieldName] = value;
            await this.savePortfolioData(currentData);
            return true;
        } catch (error) {
            console.error(`Error updating field ${fieldName}:`, error);
            throw error;
        }
    }

    // Real-time data updates listener
    onPortfolioDataUpdate(callback) {
        return this.db.collection(this.collectionName).doc(this.documentId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    callback(data);
                }
            }, (error) => {
                console.error('Error listening to portfolio data updates:', error);
            });
    }

    // Export data (for backup purposes)
    async exportData() {
        try {
            const data = await this.loadPortfolioData();
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'portfolio-data.json';
            link.click();
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    }

    // Import data
    async importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            // Validate the data structure
            if (this.validateImportedData(data)) {
                await this.savePortfolioData(data);
                return true;
            } else {
                throw new Error('Invalid data structure');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            throw error;
        }
    }

    // Validate imported data structure
    validateImportedData(data) {
        const requiredFields = ['name', 'specializations', 'about', 'skills', 'projects', 'jobs', 'contactLinks'];
        return requiredFields.every(field => data.hasOwnProperty(field));
    }

    // Reset to default data
    async resetToDefault() {
        try {
            const defaultData = this.getDefaultPortfolioData();
            await this.savePortfolioData(defaultData);
            return true;
        } catch (error) {
            console.error('Error resetting portfolio data:', error);
            throw error;
        }
    }
}

// Create global instance
const firebasePortfolioManager = new FirebasePortfolioManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FirebasePortfolioManager, firebasePortfolioManager };
} 