// Portfolio Website JavaScript

class PortfolioManager {
    constructor() {
        this.portfolioData = null;
        this.init();
    }

    async init() {
        try {
            // Add loading class to body
            document.body.classList.add('loading');
            
            // Load data first
            await this.loadData();
            
            // Wait for 1 second to show loading screen
            await this.delay(1000);
            
            // Hide loading screen and show content
            this.hideLoadingScreen();
            
            // Setup everything else
            this.setupEventListeners();
            this.renderSkills();
            this.renderProjects();
            this.renderJobs();
            
            // Update basic portfolio information
            this.updateBasicInfo();
            this.renderSpecializations();
            this.updateContactLinks();
            
            // Set up real-time updates from Firebase
            this.setupRealTimeUpdates();
        } catch (error) {
            console.error('Error initializing portfolio manager:', error);
            // Hide loading screen even if there's an error
            this.hideLoadingScreen();
        }
    }

    // Utility method to delay execution
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Hide loading screen and show main content
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            // Remove loading class and add loaded class to body
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
            
            // Remove loading screen from DOM after transition
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }
    }

    // Load portfolio data from Firebase
    async loadData() {
        try {
            this.portfolioData = await firebasePortfolioManager.loadPortfolioData();
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            // Fallback to default data
            this.portfolioData = firebasePortfolioManager.getDefaultPortfolioData();
        }
    }

    // Update basic portfolio information (name, about, photo)
    updateBasicInfo() {
        try {
            if (this.portfolioData) {
                // Update name
                const nameElement = document.querySelector('.name');
                if (nameElement && this.portfolioData.name) {
                    nameElement.textContent = this.portfolioData.name;
                }

                // Update about text
                const aboutElement = document.querySelector('.about-text p');
                if (aboutElement && this.portfolioData.about) {
                    aboutElement.textContent = this.portfolioData.about;
                }

            }
        } catch (error) {
            console.error('Error updating basic info:', error);
        }
    }

    // Save portfolio data to Firebase
    async saveData() {
        try {
            if (this.portfolioData) {
                await firebasePortfolioManager.savePortfolioData(this.portfolioData);
            }
        } catch (error) {
            console.error('Error saving portfolio data to Firebase:', error);
        }
    }

    // Update portfolio data
    updatePortfolioData(newData) {
        this.portfolioData = { ...this.portfolioData, ...newData };
        this.saveData();
        this.applyData();
    }

    // Setup event listeners
    setupEventListeners() {
        // Contact icons click
        this.setupContactIcons();
        
        // Setup theme toggle
        this.setupThemeToggle();
        
        // Setup mouse-responsive wallpaper
        this.setupMouseResponsiveWallpaper();
        
        // Setup scroll effects (back-to-top button and progress bar)
        this.setupScrollEffects();
    }

    // Set up real-time updates from Firebase
    setupRealTimeUpdates() {
        try {
            firebasePortfolioManager.onPortfolioDataUpdate((updatedData) => {
                this.portfolioData = updatedData;
                this.updateBasicInfo();
                this.renderSkills();
                this.renderProjects();
                this.renderJobs();
                this.renderSpecializations();
                this.updateContactLinks();
            });
        } catch (error) {
            console.error('Error setting up real-time updates in portfolio:', error);
        }
    }

    // Setup contact icons functionality
    setupContactIcons() {
        // This function can be used to add any special functionality to contact icons
        // For now, the links are handled by updateContactLinks()
    }

    // Render specializations
    renderSpecializations() {
        const container = document.querySelector('.specializations');
        container.innerHTML = '';
        this.portfolioData.specializations.forEach(spec => {
            const span = document.createElement('span');
            span.className = 'specialization';
            span.textContent = spec;
            container.appendChild(span);
        });
    }

    // Update contact links
    updateContactLinks() {
        const contactIcons = document.querySelectorAll('.contact-icon');
        contactIcons.forEach(icon => {
            const platform = icon.getAttribute('data-platform');
            const link = this.portfolioData.contactLinks[platform];
            
            if (link) {
                if (platform === 'email') {
                    icon.href = `mailto:${link}`;
                } else if (platform === 'phone') {
                    icon.href = `tel:${link}`;
                } else if (platform === 'whatsapp') {
                    icon.href = `https://wa.me/${link.replace('+', '')}`;
                } else if (platform === 'telegram') {
                    icon.href = `https://t.me/${link.replace('@', '')}`;
                } else if (platform === 'discord') {
                    icon.href = `https://discord.com/users/${link}`;
                } else {
                    icon.href = link;
                }
            }
        });
    }

    // Render skills
    renderSkills() {
        try {
            const skillsGrid = document.getElementById('skillsGrid');
            
            if (!skillsGrid) {
                console.error('skillsGrid element not found!');
                return;
            }
            
            skillsGrid.innerHTML = '';
            
            if (this.portfolioData.skills && this.portfolioData.skills.length > 0) {
                this.portfolioData.skills.forEach((skill, index) => {
                    try {
                        const skillCard = this.createSkillCard(skill, index);
                        
                        if (skillCard) {
                            skillsGrid.appendChild(skillCard);
                        } else {
                            console.error('Failed to create skill card for skill:', skill);
                        }
                    } catch (skillError) {
                        console.error('Error rendering individual skill:', skillError, 'Skill data:', skill);
                    }
                });
            } else {
                skillsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No skills data available.</p>';
            }
        } catch (error) {
            console.error('Error in renderSkills function:', error);
            console.error('portfolioData:', this.portfolioData);
        }
    }

    // Create skill card
    createSkillCard(skill, index) {
        
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        
        // Get skill icon based on category
        const getSkillIcon = (category) => {
            const icons = {
                'frontend': 'fas fa-palette',
                'backend': 'fas fa-server',
                'design': 'fas fa-paint-brush',
                'tools': 'fas fa-tools',
                'database': 'fas fa-database',
                'mobile': 'fas fa-mobile-alt',
                'devops': 'fas fa-cloud',
                'ai': 'fas fa-brain',
                'default': 'fas fa-code'
            };
            return icons[category] || icons.default;
        };
        
        // Generate star rating
        const generateStars = (rating) => {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            
            let stars = '';
            for (let i = 0; i < fullStars; i++) {
                stars += '<i class="fas fa-star"></i>';
            }
            if (hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            }
            for (let i = 0; i < emptyStars; i++) {
                stars += '<i class="far fa-star"></i>';
            }
            return stars;
        };
        
        const skillHTML = `
            <div class="skill-card-content">
                <div class="skill-card-header">
                    <div class="skill-card-icon">
                        <i class="${getSkillIcon(skill.category)}"></i>
                    </div>
                    <div class="skill-card-title">
                        <h3>${skill.name || 'Skill Name'}</h3>
                        <span class="skill-card-category">${skill.category || 'General'}</span>
                    </div>
                </div>
                
                <div class="skill-rating-section">
                    <div class="skill-rating">
                        <span>Rating</span>
                        <span class="rating-value">${skill.rating || 3}/5</span>
                    </div>
                    <div class="rating-stars">
                        ${generateStars(skill.rating || 3)}
                    </div>
                </div>
            </div>
        `;
        
        skillCard.innerHTML = skillHTML;
        
        return skillCard;
    }

    // Render projects
    renderProjects() {
        try {
            const projectsGrid = document.getElementById('projectsGrid');
            
            if (!projectsGrid) {
                console.error('projectsGrid element not found!');
                return;
            }
            
            projectsGrid.innerHTML = '';
            
            if (this.portfolioData.projects && this.portfolioData.projects.length > 0) {
                this.portfolioData.projects.forEach((project, index) => {
                    try {
                        const projectCard = this.createProjectCard(project, index);
                        
                        if (projectCard) {
                            projectsGrid.appendChild(projectCard);
                        } else {
                            console.error('Failed to create project card for project:', project);
                        }
                    } catch (projectError) {
                        console.error('Error rendering individual project:', projectError, 'Project data:', project);
                    }
                });
            } else {
                projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No projects data available.</p>';
            }
        } catch (error) {
            console.error('Error in renderProjects function:', error);
            console.error('portfolioData:', this.portfolioData);
        }
    }

    // Create project card
    createProjectCard(project, index) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        projectCard.innerHTML = `
            <div class="project-image">${project.image}</div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fab fa-github"></i> Code</a>` : ''}
                </div>
            </div>
        `;

        return projectCard;
    }

    // Render jobs
    renderJobs() {
        try {
            const jobsGrid = document.getElementById('jobsGrid');
            
            if (!jobsGrid) {
                console.error('jobsGrid element not found!');
                return;
            }
            
            jobsGrid.innerHTML = '';
            
            if (this.portfolioData.jobs && this.portfolioData.jobs.length > 0) {
                this.portfolioData.jobs.forEach((job, index) => {
                    try {
                        const jobCard = this.createJobCard(job, index);
                        
                        if (jobCard) {
                            jobsGrid.appendChild(jobCard);
                        } else {
                            console.error('Failed to create job card for job:', job);
                        }
                    } catch (jobError) {
                        console.error('Error rendering individual job:', jobError, 'Job data:', job);
                    }
                });
            } else {
                jobsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No work experience data available.</p>';
            }
        } catch (error) {
            console.error('Error in renderJobs function:', error);
            console.error('portfolioData:', this.portfolioData);
        }
    }

    // Create job card
    createJobCard(job, index) {
        try {
            if (!job || typeof job !== 'object') {
                console.error('Invalid job data:', job);
                return null;
            }
            
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            
            // Validate required fields
            const title = job.title || 'No Title';
            const company = job.company || 'No Company';
            const type = job.type || 'No Type';
            const duration = job.duration || 'No Duration';
            const location = job.location || 'No Location';
            const siteType = job.siteType || 'No Site Type';
            const status = job.status || 'No Status';
            const description = job.description || 'No Description';
            const socialMedia = job.socialMedia || '#';
            
            jobCard.innerHTML = `
                <div class="job-header">
                    <div class="job-title-section">
                        <h3 class="job-title">${title}</h3>
                        <div class="job-company">${company}</div>
                    </div>
                    <div class="job-duration">${duration}</div>
                </div>
                <div class="job-actions">
                    <button class="job-details-btn" data-job-index="${index}">
                        <i class="fas fa-info-circle"></i> View Details
                    </button>
                </div>
            `;
            
            // Add click event listener to the details button
            const detailsBtn = jobCard.querySelector('.job-details-btn');
            detailsBtn.addEventListener('click', (event) => {
                this.showJobDetails(index, event);
            });
            
            return jobCard;
        } catch (error) {
            console.error('Error creating job card:', error);
            console.error('Job data that caused error:', job);
            return null;
        }
    }

    // Show job details
    showJobDetails(jobIndex, event) {
        // Safety check - if called from global scope, use window.portfolioManager
        const manager = this.portfolioData ? this : window.portfolioManager;
        const job = manager.portfolioData.jobs[jobIndex];
        
        // Remove any existing popup
        const existingPopup = document.querySelector('.job-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // Create popup modal
        const popup = document.createElement('div');
        popup.className = 'job-popup';
        popup.innerHTML = `
            <div class="job-popup-content">
                <div class="job-popup-header">
                    <h3>${job.title}</h3>
                    <button class="job-popup-close" onclick="this.closest('.job-popup').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="job-popup-body">
                    <div class="job-popup-info">
                        <div class="job-info-row">
                            <strong>Company:</strong> ${job.company}
                        </div>
                        <div class="job-info-row">
                            <strong>Type:</strong> ${job.type}
                        </div>
                        <div class="job-info-row">
                            <strong>Duration:</strong> ${job.duration}
                        </div>
                        <div class="job-info-row">
                            <strong>Location:</strong> ${job.location}
                        </div>
                        <div class="job-info-row">
                            <strong>Site Type:</strong> ${job.siteType}
                        </div>
                        <div class="job-info-row">
                            <strong>Status:</strong> 
                            <span class="job-status ${job.status.toLowerCase()}">${job.status}</span>
                        </div>
                    </div>
                    <div class="job-popup-description">
                        <strong>Description:</strong>
                        <p>${job.description}</p>
                    </div>
                    ${job.socialMedia && job.socialMedia !== '#' ? `
                        <div class="job-popup-actions">
                            <a href="${job.socialMedia}" target="_blank" class="job-link">
                                <i class="fas fa-external-link-alt"></i> Visit Company
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Add popup to body
        document.body.appendChild(popup);
        
        // Add click outside to close functionality
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
        
        // Add escape key to close functionality
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                popup.remove();
            }
        });
    }




    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Get notification icon based on type
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Setup scroll effects
    setupScrollEffects() {
        const backToTopBtn = document.getElementById('backToTop');
        const progressBar = document.getElementById('progressBar');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                // Show/hide back to top button
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
                
                // Update progress bar
                if (progressBar) {
                    const scrollTop = window.pageYOffset;
                    const docHeight = document.body.scrollHeight - window.innerHeight;
                    const scrollPercent = (scrollTop / docHeight) * 100;
                    progressBar.style.width = scrollPercent + '%';
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Add fade-in animations to sections
        this.setupFadeInAnimations();
    }

    // Setup fade-in animations
    setupFadeInAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('fade-in');
            observer.observe(section);
        });
    }

    // Setup theme toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
                
            });
        } else {
            console.error('Theme toggle button not found!');
        }
    }

    // Setup mouse-responsive wallpaper
    setupMouseResponsiveWallpaper() {
        const wallpaperGlow = document.querySelector('.wallpaper-glow');
        if (!wallpaperGlow) return;

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Update CSS custom properties for mouse position
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
            
            // Add subtle parallax effect to wallpaper layers
            const moveX = (x - window.innerWidth / 2) * 0.01;
            const moveY = (y - window.innerHeight / 2) * 0.01;
            
            const wallpaperBg = document.querySelector('.wallpaper-bg');
            const wallpaperParticles = document.querySelector('.wallpaper-particles');
            
            if (wallpaperBg) {
                wallpaperBg.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
            
            if (wallpaperParticles) {
                wallpaperParticles.style.transform = `translate(${-moveX * 2}px, ${-moveY * 2}px)`;
            }
        });

        // Add touch support for mobile devices
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const x = touch.clientX;
            const y = touch.clientY;
            
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    // Update theme icon
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                themeToggle.title = 'Switch to Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                themeToggle.title = 'Switch to Dark Mode';
            }
        } else {
            console.error('Theme toggle button not found in updateThemeIcon');
        }
    }
}

// Initialize the portfolio manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
});

// Global error handler for portfolio manager
window.addEventListener('error', (event) => {
    if (event.error && event.error.message && event.error.message.includes('portfolioManager')) {
        console.warn('PortfolioManager not ready yet, retrying...');
        // The error will be resolved once the DOM is loaded
    }
}); 
