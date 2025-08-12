// Admin Dashboard JavaScript

class AdminDashboard {
    constructor() {
        this.portfolioData = null;
        this.currentEditingSkill = null;
        this.currentEditingJob = null;
        this.currentEditingProject = null;
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            
            // Ensure data is loaded before rendering
            if (this.portfolioData && this.portfolioData.projects && this.portfolioData.skills && this.portfolioData.jobs) {
                this.setupEventListeners();
                this.setupTabNavigation();
                this.populateFormFields();
                this.renderSkills();
                this.renderProjects();
                this.renderJobs();
                this.updateStatus();
                
                // Set up real-time updates from Firebase
                this.setupRealTimeUpdates();
            } else {
                console.error('Portfolio data not properly loaded. Retrying...');
                // Retry after a short delay
                setTimeout(async () => {
                    await this.loadData();
                    if (this.portfolioData && this.portfolioData.projects && this.portfolioData.skills && this.portfolioData.jobs) {
                        this.setupEventListeners();
                        this.setupTabNavigation();
                        this.populateFormFields();
                        this.renderSkills();
                        this.renderProjects();
                        this.renderJobs();
                        this.updateStatus();
                        this.setupRealTimeUpdates();
                    } else {
                        console.error('Failed to load portfolio data after retry');
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error initializing admin dashboard:', error);
        }
    }

    // Load portfolio data from Firebase
    async loadData() {
        try {
            this.portfolioData = await firebasePortfolioManager.loadPortfolioData();
        } catch (error) {
            console.error('Error loading portfolio data from Firebase:', error);
            // Fallback to default data
            this.portfolioData = firebasePortfolioManager.getDefaultPortfolioData();
        }
    }

    // Set up real-time updates from Firebase
    setupRealTimeUpdates() {
        try {
            firebasePortfolioManager.onPortfolioDataUpdate((updatedData) => {
                this.portfolioData = updatedData;
                this.populateFormFields();
                this.renderSkills();
                this.renderProjects();
                this.renderJobs();
            });
        } catch (error) {
            console.error('Error setting up real-time updates in admin:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Save all button
        document.getElementById('saveAllBtn').addEventListener('click', () => {
            this.saveAllChanges();
        });

        // View portfolio button
        document.getElementById('viewPortfolioBtn').addEventListener('click', () => {
            window.open('index.html', '_blank');
        });



        // Auto-save functionality
        this.setupAutoSave();

        // Add skill button
        const addSkillBtn = document.getElementById('addSkillBtn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                this.showSkillModal();
            });
        }

        // Add job button
        const addJobBtn = document.getElementById('addJobBtn');
        if (addJobBtn) {
            addJobBtn.addEventListener('click', () => {
                this.showJobModal();
            });
        }

        // Add project button
        const addProjectBtn = document.getElementById('addProjectBtn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                this.showProjectModal();
            });
        }

        // Job modal buttons
        const jobModalSaveBtn = document.getElementById('jobModalSave');
        const jobModalCancelBtn = document.getElementById('jobModalCancel');
        if (jobModalSaveBtn) {
            jobModalSaveBtn.addEventListener('click', () => {
                this.saveJob();
            });
        }
        if (jobModalCancelBtn) {
            jobModalCancelBtn.addEventListener('click', () => {
                this.hideJobModal();
            });
        }

        // Project modal buttons
        const projectModalSaveBtn = document.getElementById('projectModalSave');
        const projectModalCancelBtn = document.getElementById('projectModalCancel');
        if (projectModalSaveBtn) {
            projectModalSaveBtn.addEventListener('click', () => {
                this.saveProject();
            });
        }
        if (projectModalCancelBtn) {
            projectModalCancelBtn.addEventListener('click', () => {
                this.hideProjectModal();
            });
        }

        // Skill modal buttons
        const skillModalSaveBtn = document.getElementById('skillModalSave');
        const skillModalCancelBtn = document.getElementById('skillModalCancel');
        if (skillModalSaveBtn) {
            skillModalSaveBtn.addEventListener('click', () => {
                this.saveSkill();
            });
        }
        if (skillModalCancelBtn) {
            skillModalCancelBtn.addEventListener('click', () => {
                this.hideSkillModal();
            });
        }

        // Modal close buttons (X buttons)
        const skillModalCloseBtn = document.getElementById('skillModalClose');
        const jobModalCloseBtn = document.getElementById('jobModalClose');
        const projectModalCloseBtn = document.getElementById('projectModalClose');
        
        if (skillModalCloseBtn) {
            skillModalCloseBtn.addEventListener('click', () => {
                this.hideSkillModal();
            });
        }
        if (jobModalCloseBtn) {
            jobModalCloseBtn.addEventListener('click', () => {
                this.hideJobModal();
            });
        }
        if (projectModalCloseBtn) {
            projectModalCloseBtn.addEventListener('click', () => {
                this.hideProjectModal();
            });
        }

        // Reorder skills button
        const reorderSkillsBtn = document.getElementById('reorderSkillsBtn');
        if (reorderSkillsBtn) {
            reorderSkillsBtn.addEventListener('click', () => {
                this.toggleSkillsReorder();
            });
        }

        // Other admin buttons
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const exportDataBtn = document.getElementById('exportDataBtn');
        const importDataBtn = document.getElementById('importDataBtn');
        const resetDataBtn = document.getElementById('resetDataBtn');
        const clearAndReloadBtn = document.getElementById('clearAndReloadBtn');
        const refreshDataBtn = document.getElementById('refreshDataBtn');
        const importFileInput = document.getElementById('importFileInput');

        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.changeAdminPassword();
            });
        }
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => {
                importFileInput.click();
            });
        }
        if (importFileInput) {
            importFileInput.addEventListener('change', (event) => {
                this.importData(event);
            });
        }
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => {
                this.resetToDefault();
            });
        }
        if (clearAndReloadBtn) {
            clearAndReloadBtn.addEventListener('click', () => {
                this.clearAndReload();
            });
        }
        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', () => {
                this.loadData();
                this.populateFormFields();
                this.renderSkills();
                this.renderProjects();
                this.renderJobs();
                this.updateStatus('Data refreshed');
            });
        }

        // Tab navigation
        this.setupTabNavigation();
    }

    // Setup tab navigation
    setupTabNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });

        // Set profile tab as active by default
        const profileTab = document.querySelector('[data-tab="profile"]');
        const profileTabContent = document.getElementById('profile-tab');
        if (profileTab && profileTabContent) {
            profileTab.classList.add('active');
            profileTabContent.classList.add('active');
        }
    }



    // Populate form fields with current data
    populateFormFields() {
        // Profile fields
        document.getElementById('profileName').value = this.portfolioData.name;
        document.getElementById('profileSpecializations').value = this.portfolioData.specializations.join(', ');

        // About field
        document.getElementById('aboutText').value = this.portfolioData.about;

        // Contact fields
        document.getElementById('githubLink').value = this.portfolioData.contactLinks.github;
        document.getElementById('linkedinLink').value = this.portfolioData.contactLinks.linkedin;
        document.getElementById('facebookLink').value = this.portfolioData.contactLinks.facebook;
        document.getElementById('whatsappLink').value = this.portfolioData.contactLinks.whatsapp;
        document.getElementById('discordLink').value = this.portfolioData.contactLinks.discord;
        document.getElementById('telegramLink').value = this.portfolioData.contactLinks.telegram;
        document.getElementById('emailLink').value = this.portfolioData.contactLinks.email;
        document.getElementById('phoneLink').value = this.portfolioData.contactLinks.phone;
    }

    // Setup auto-save functionality
    setupAutoSave() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateStatus('Modified - Save to apply changes');
            });
        });
    }

    // Save all changes
    async saveAllChanges() {
        try {
            // Collect form data
            this.portfolioData.name = document.getElementById('profileName').value;
            this.portfolioData.specializations = document.getElementById('profileSpecializations').value
                .split(',').map(s => s.trim()).filter(s => s.length > 0);
            this.portfolioData.about = document.getElementById('aboutText').value;

            // Collect contact data
            this.portfolioData.contactLinks.github = document.getElementById('githubLink').value;
            this.portfolioData.contactLinks.linkedin = document.getElementById('linkedinLink').value;
            this.portfolioData.contactLinks.facebook = document.getElementById('facebookLink').value;
            this.portfolioData.contactLinks.whatsapp = document.getElementById('whatsappLink').value;
            this.portfolioData.contactLinks.discord = document.getElementById('discordLink').value;
            this.portfolioData.contactLinks.telegram = document.getElementById('telegramLink').value;
            this.portfolioData.contactLinks.email = document.getElementById('emailLink').value;
            this.portfolioData.contactLinks.phone = document.getElementById('phoneLink').value;

            // Save to Firebase
            await firebasePortfolioManager.savePortfolioData(this.portfolioData);

            // Update status
            this.updateStatus('All changes saved successfully');
            this.showNotification('All changes saved successfully!', 'success');

            // Update last saved time
            const now = new Date();
            document.getElementById('lastSaved').textContent = `Last saved: ${now.toLocaleString()}`;

        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error saving data. Please try again.', 'error');
        }
    }

    // Render skills list
    renderSkills() {
        try {
            const skillsList = document.getElementById('skillsList');
            
            if (!skillsList) {
                console.error('skillsList element not found!');
                return;
            }
            
            skillsList.innerHTML = '';
            
            if (this.portfolioData.skills && this.portfolioData.skills.length > 0) {
                this.portfolioData.skills.forEach((skill, index) => {
                    try {
                        const skillCard = document.createElement('div');
                        skillCard.className = 'skill-card';
                        skillCard.innerHTML = `
                            <div class="skill-info">
                                <h4>${skill.name}</h4>
                                <div class="skill-rating">Rating: ${skill.rating}/5</div>
                            </div>
                            <div class="skill-actions">
                                <button class="edit-btn" onclick="adminDashboard.editSkill(${index})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-btn" onclick="adminDashboard.deleteSkill(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                        skillsList.appendChild(skillCard);
                    } catch (skillError) {
                        console.error('Error rendering individual skill:', skillError, 'Skill data:', skill);
                    }
                });
            } else {
                skillsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No skills data available.</p>';
            }
        } catch (error) {
            console.error('Error in renderSkills function:', error);
            console.error('portfolioData:', this.portfolioData);
        }
    }

    // Render projects list
    renderProjects() {
        try {
            const projectsList = document.getElementById('projectsList');
            if (!projectsList) {
                console.error('projectsList element not found!');
                return;
            }
            
            projectsList.innerHTML = '';
            
            if (this.portfolioData.projects && this.portfolioData.projects.length > 0) {
                this.portfolioData.projects.forEach((project, index) => {
                    try {
                        const projectCard = document.createElement('div');
                        projectCard.className = 'project-card-admin';
                        projectCard.innerHTML = `
                            <div class="project-info">
                                <h4>${project.title}</h4>
                                <div class="project-description">${project.description}</div>
                                <div class="project-tech">Tech: ${project.tech.join(', ')}</div>
                                <div class="project-links">
                                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Live</a>` : ''}
                                    ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link"><i class="fab fa-github"></i> GitHub</a>` : ''}
                                </div>
                            </div>
                            <div class="project-actions">
                                <button class="edit-btn" onclick="adminDashboard.editProject(${index})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-btn" onclick="adminDashboard.deleteProject(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                        projectsList.appendChild(projectCard);
                    } catch (projectError) {
                        console.error('Error rendering individual project:', projectError, 'Project data:', project);
                    }
                });
            } else {
                projectsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No projects data available.</p>';
            }
        } catch (error) {
            console.error('Error in renderProjects function:', error);
            console.error('portfolioData:', this.portfolioData);
        }
    }

    // Render jobs list
    renderJobs() {
        try {
            const jobsList = document.getElementById('jobsList');
            
            if (!jobsList) {
                console.error('jobsList element not found!');
                return;
            }
            
            jobsList.innerHTML = '';
            
            if (this.portfolioData.jobs && this.portfolioData.jobs.length > 0) {
                this.portfolioData.jobs.forEach((job, index) => {
                    try {
                        const jobCard = document.createElement('div');
                        jobCard.className = 'job-card-admin';
                        jobCard.innerHTML = `
                            <div class="job-info">
                                <h4>${job.title}</h4>
                                <div class="job-company">${job.company}</div>
                                <div class="job-duration">${job.duration}</div>
                                <div class="job-status ${job.status === 'Current' ? 'current' : 'previous'}">${job.status}</div>
                            </div>
                            <div class="job-actions">
                                <button class="edit-btn" onclick="adminDashboard.editJob(${index})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-btn" onclick="adminDashboard.deleteJob(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                        jobsList.appendChild(jobCard);
                    } catch (jobError) {
                        console.error('Error rendering individual job:', jobError, 'Job data:', job);
                    }
                });
            } else {
                jobsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No jobs data available.</p>';
            }
        } catch (error) {
            console.error('Error in renderJobs function:', error);
            console.error('portfolioData:', this.portfolioData);
        }
    }

    // Show skill modal
    showSkillModal(skillIndex = null) {
        const modal = document.getElementById('skillModal');
        const modalTitle = document.getElementById('skillModalTitle');
        const skillNameInput = document.getElementById('skillName');
        const skillCategoryInput = document.getElementById('skillCategory');
        const skillRatingInput = document.getElementById('skillRating');
        const ratingValue = document.getElementById('ratingValue');

        if (skillIndex !== null) {
            // Editing existing skill
            const skill = this.portfolioData.skills[skillIndex];
            modalTitle.textContent = 'Edit Skill';
            skillNameInput.value = skill.name;
            skillCategoryInput.value = skill.category || 'frontend';
            skillRatingInput.value = skill.rating;
            ratingValue.textContent = skill.rating;
            this.currentEditingSkill = skillIndex;
        } else {
            // Adding new skill
            modalTitle.textContent = 'Add New Skill';
            skillNameInput.value = '';
            skillCategoryInput.value = 'frontend';
            skillRatingInput.value = 3;
            ratingValue.textContent = '3';
            this.currentEditingSkill = null;
        }

        modal.classList.add('active');
    }

    // Hide skill modal
    hideSkillModal() {
        document.getElementById('skillModal').classList.remove('active');
        this.currentEditingSkill = null;
    }

    // Save skill
    async saveSkill() {
        const skillName = document.getElementById('skillName').value.trim();
        const skillCategory = document.getElementById('skillCategory').value;
        const skillRating = parseInt(document.getElementById('skillRating').value);

        if (!skillName) {
            this.showNotification('Please enter a skill name', 'error');
            return;
        }

        if (this.currentEditingSkill !== null) {
            // Update existing skill
            this.portfolioData.skills[this.currentEditingSkill] = {
                name: skillName,
                rating: skillRating,
                category: skillCategory
            };
        } else {
            // Add new skill
            this.portfolioData.skills.push({
                name: skillName,
                rating: skillRating,
                category: skillCategory
            });
        }

        // Save and refresh
        await firebasePortfolioManager.savePortfolioData(this.portfolioData);
        this.renderSkills();
        this.hideSkillModal();
        this.showNotification('Skill saved successfully!', 'success');
        this.updateStatus('Modified - Save to apply changes');
    }

    // Edit skill
    editSkill(index) {
        this.showSkillModal(index);
    }

    // Delete skill
    async deleteSkill(index) {
        if (confirm(`Are you sure you want to delete "${this.portfolioData.skills[index].name}"?`)) {
            this.portfolioData.skills.splice(index, 1);
            await firebasePortfolioManager.savePortfolioData(this.portfolioData);
            this.renderSkills();
            this.showNotification('Skill deleted successfully!', 'success');
            this.updateStatus('Modified - Save to apply changes');
        }
    }

    // Show project modal
    showProjectModal(projectIndex = null) {
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('projectModalTitle');
        const projectTitleInput = document.getElementById('projectTitle');
        const projectDescriptionInput = document.getElementById('projectDescription');
        const projectImageInput = document.getElementById('projectImage');
        const projectTechInput = document.getElementById('projectTech');
        const projectLiveUrlInput = document.getElementById('projectLiveUrl');
        const projectGithubUrlInput = document.getElementById('projectGithubUrl');

        if (projectIndex !== null) {
            // Editing existing project
            const project = this.portfolioData.projects[projectIndex];
            modalTitle.textContent = 'Edit Project';
            projectTitleInput.value = project.title;
            projectDescriptionInput.value = project.description;
            projectImageInput.value = project.image;
            projectTechInput.value = project.tech.join(', ');
            projectLiveUrlInput.value = project.liveUrl;
            projectGithubUrlInput.value = project.githubUrl;
            this.currentEditingProject = projectIndex;
        } else {
            // Adding new project
            modalTitle.textContent = 'Add New Project';
            projectTitleInput.value = '';
            projectDescriptionInput.value = '';
            projectImageInput.value = '';
            projectTechInput.value = '';
            projectLiveUrlInput.value = '';
            projectGithubUrlInput.value = '';
            this.currentEditingProject = null;
        }

        modal.classList.add('active');
    }

    // Hide project modal
    hideProjectModal() {
        document.getElementById('projectModal').classList.remove('active');
        this.currentEditingProject = null;
    }

    // Populate project form
    populateProjectForm(project) {
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectImage').value = project.image;
        document.getElementById('projectTech').value = project.tech.join(', ');
        document.getElementById('projectLiveUrl').value = project.liveUrl;
        document.getElementById('projectGithubUrl').value = project.githubUrl;
    }

    // Clear project form
    clearProjectForm() {
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('projectImage').value = '';
        document.getElementById('projectTech').value = '';
        document.getElementById('projectLiveUrl').value = '';
        document.getElementById('projectGithubUrl').value = '';
    }

    // Save project
    async saveProject() {
        const projectData = {
            title: document.getElementById('projectTitle').value.trim(),
            description: document.getElementById('projectDescription').value.trim(),
            image: document.getElementById('projectImage').value.trim(),
            tech: document.getElementById('projectTech').value.split(',').map(s => s.trim()).filter(s => s.length > 0),
            liveUrl: document.getElementById('projectLiveUrl').value.trim(),
            githubUrl: document.getElementById('projectGithubUrl').value.trim()
        };

        if (!projectData.title || !projectData.description) {
            this.showNotification('Please fill in all required fields (Title, Description)', 'error');
            return;
        }

        if (this.currentEditingProject !== null) {
            // Update existing project
            this.portfolioData.projects[this.currentEditingProject] = projectData;
        } else {
            // Add new project
            this.portfolioData.projects.push(projectData);
        }

        // Save and refresh
        await firebasePortfolioManager.savePortfolioData(this.portfolioData);
        this.renderProjects();
        this.hideProjectModal();
        this.showNotification('Project saved successfully!', 'success');
        this.updateStatus('Modified - Save to apply changes');
    }

    // Edit project
    editProject(index) {
        this.showProjectModal(index);
    }

    // Delete project
    async deleteProject(index) {
        if (confirm(`Are you sure you want to delete "${this.portfolioData.projects[index].title}"?`)) {
            this.portfolioData.projects.splice(index, 1);
            await firebasePortfolioManager.savePortfolioData(this.portfolioData);
            this.renderProjects();
            this.showNotification('Project deleted successfully!', 'success');
            this.updateStatus('Modified - Save to apply changes');
        }
    }

    // Show job modal
    showJobModal(jobIndex = null) {
        const modal = document.getElementById('jobModal');
        const modalTitle = document.getElementById('jobModalTitle');
        
        if (jobIndex !== null) {
            // Editing existing job
            const job = this.portfolioData.jobs[jobIndex];
            modalTitle.textContent = 'Edit Job';
            this.populateJobForm(job);
            this.currentEditingJob = jobIndex;
        } else {
            // Adding new job
            modalTitle.textContent = 'Add New Job';
            this.clearJobForm();
            this.currentEditingJob = null;
        }

        modal.classList.add('active');
    }

    // Hide job modal
    hideJobModal() {
        document.getElementById('jobModal').classList.remove('active');
        this.currentEditingJob = null;
    }

    // Populate job form
    populateJobForm(job) {
        document.getElementById('jobTitle').value = job.title;
        document.getElementById('jobCompany').value = job.company;
        document.getElementById('jobType').value = job.type;
        document.getElementById('jobDuration').value = job.duration;
        document.getElementById('jobLocation').value = job.location;
        document.getElementById('jobSiteType').value = job.siteType;
        document.getElementById('jobStatus').value = job.status;
        document.getElementById('jobSocialMedia').value = job.socialMedia;
        document.getElementById('jobDescription').value = job.description;
    }

    // Clear job form
    clearJobForm() {
        document.getElementById('jobTitle').value = '';
        document.getElementById('jobCompany').value = '';
        document.getElementById('jobType').value = 'Full-time';
        document.getElementById('jobDuration').value = '';
        document.getElementById('jobLocation').value = '';
        document.getElementById('jobSiteType').value = 'On-site';
        document.getElementById('jobStatus').value = 'Current';
        document.getElementById('jobSocialMedia').value = '';
        document.getElementById('jobDescription').value = '';
    }

    // Save job
    async saveJob() {
        const jobData = {
            title: document.getElementById('jobTitle').value.trim(),
            company: document.getElementById('jobCompany').value.trim(),
            type: document.getElementById('jobType').value,
            duration: document.getElementById('jobDuration').value.trim(),
            location: document.getElementById('jobLocation').value.trim(),
            siteType: document.getElementById('jobSiteType').value,
            status: document.getElementById('jobStatus').value,
            socialMedia: document.getElementById('jobSocialMedia').value.trim(),
            description: document.getElementById('jobDescription').value.trim()
        };

        if (!jobData.title || !jobData.company || !jobData.duration) {
            this.showNotification('Please fill in all required fields (Title, Company, Duration)', 'error');
            return;
        }

        if (this.currentEditingJob !== null) {
            // Update existing job
            this.portfolioData.jobs[this.currentEditingJob] = jobData;
        } else {
            // Add new job
            this.portfolioData.jobs.push(jobData);
        }

        // Save and refresh
        await firebasePortfolioManager.savePortfolioData(this.portfolioData);
        this.renderJobs();
        this.hideJobModal();
        this.showNotification('Job saved successfully!', 'success');
        this.updateStatus('Modified - Save to apply changes');
    }

    // Edit job
    editJob(index) {
        this.showJobModal(index);
    }

    // Delete job
    async deleteJob(index) {
        if (confirm(`Are you sure you want to delete "${this.portfolioData.jobs[index].title}" at ${this.portfolioData.jobs[index].company}"?`)) {
            this.portfolioData.jobs.splice(index, 1);
            await firebasePortfolioManager.savePortfolioData(this.portfolioData);
            this.renderJobs();
            this.showNotification('Job deleted successfully!', 'success');
            this.updateStatus('Modified - Save to apply changes');
        }
    }

    // Toggle skills reorder mode
    toggleSkillsReorder() {
        const skillsList = document.getElementById('skillsList');
        const isReorderMode = skillsList.classList.contains('reorder-mode');

        if (isReorderMode) {
            // Exit reorder mode
            this.exitReorderMode();
        } else {
            // Enter reorder mode
            this.enterReorderMode();
        }
    }

    // Enter reorder mode
    enterReorderMode() {
        const skillsList = document.getElementById('skillsList');
        const reorderBtn = document.getElementById('reorderSkillsBtn');
        
        skillsList.classList.add('reorder-mode');
        reorderBtn.innerHTML = '<i class="fas fa-check"></i> Done Reordering';
        reorderBtn.classList.remove('btn-secondary');
        reorderBtn.classList.add('btn-success');
        
        this.showNotification('Drag and drop skills to reorder them', 'info');
        this.setupDragAndDrop();
    }

    // Exit reorder mode
    exitReorderMode() {
        const skillsList = document.getElementById('skillsList');
        const reorderBtn = document.getElementById('reorderSkillsBtn');
        
        skillsList.classList.remove('reorder-mode');
        reorderBtn.innerHTML = '<i class="fas fa-sort"></i> Reorder Skills';
        reorderBtn.classList.remove('btn-success');
        reorderBtn.classList.add('btn-secondary');
        
        this.removeDragAndDrop();
        this.saveSkillsOrder();
        this.showNotification('Skills reordering disabled', 'info');
    }

    // Setup drag and drop functionality
    setupDragAndDrop() {
        const skillCards = document.querySelectorAll('#skillsList .skill-card');
        
        skillCards.forEach((card, index) => {
            card.setAttribute('draggable', true);
            card.setAttribute('data-index', index);
            
            // Add drag event listeners
            card.addEventListener('dragstart', this.handleDragStart.bind(this));
            card.addEventListener('dragover', this.handleDragOver.bind(this));
            card.addEventListener('drop', this.handleDrop.bind(this));
            card.addEventListener('dragenter', this.handleDragEnter.bind(this));
            card.addEventListener('dragleave', this.handleDragLeave.bind(this));
            
            // Add visual feedback
            card.style.cursor = 'grab';
            card.style.transition = 'all 0.2s ease';
        });
    }

    // Remove drag and drop functionality
    removeDragAndDrop() {
        const skillCards = document.querySelectorAll('#skillsList .skill-card');
        
        skillCards.forEach(card => {
            card.removeAttribute('draggable');
            card.removeEventListener('dragstart', this.handleDragStart.bind(this));
            card.removeEventListener('dragover', this.handleDragOver.bind(this));
            card.removeEventListener('drop', this.handleDrop.bind(this));
            card.removeEventListener('dragenter', this.handleDragEnter.bind(this));
            card.removeEventListener('dragleave', this.handleDragLeave.bind(this));
            
            // Remove visual feedback
            card.style.cursor = 'default';
            card.style.transform = 'none';
            card.style.opacity = '1';
        });
    }

    // Handle drag start
    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
        e.target.style.opacity = '0.5';
        e.target.style.transform = 'scale(0.95)';
    }

    // Handle drag over
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    // Handle drag enter
    handleDragEnter(e) {
        e.preventDefault();
        if (e.target.closest('.skill-card')) {
            e.target.closest('.skill-card').style.transform = 'scale(1.05)';
            e.target.closest('.skill-card').style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        }
    }

    // Handle drag leave
    handleDragLeave(e) {
        if (e.target.closest('.skill-card')) {
            e.target.closest('.skill-card').style.transform = 'scale(1)';
            e.target.closest('.skill-card').style.boxShadow = 'none';
        }
    }

    // Handle drop
    handleDrop(e) {
        e.preventDefault();
        
        const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const dropTarget = e.target.closest('.skill-card');
        
        if (!dropTarget) return;
        
        const dropIndex = parseInt(dropTarget.dataset.index);
        
        if (draggedIndex !== dropIndex) {
            this.reorderSkills(draggedIndex, dropIndex);
        }
        
        // Reset visual feedback
        dropTarget.style.transform = 'scale(1)';
        dropTarget.style.boxShadow = 'none';
    }

    // Reorder skills in the array
    reorderSkills(fromIndex, toIndex) {
        const skills = [...this.portfolioData.skills];
        const [movedSkill] = skills.splice(fromIndex, 1);
        skills.splice(toIndex, 0, movedSkill);
        
        this.portfolioData.skills = skills;
        this.renderSkills();
        this.setupDragAndDrop(); // Re-setup drag and drop for new order
        
        this.showNotification(`Skill "${movedSkill.name}" moved to position ${toIndex + 1}`, 'success');
    }

    // Save the new skills order to Firebase
    async saveSkillsOrder() {
        try {
            await firebasePortfolioManager.savePortfolioData(this.portfolioData);
            this.showNotification('Skills order saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving skills order:', error);
            this.showNotification('Error saving skills order!', 'error');
        }
    }

    // Change admin password
    changeAdminPassword() {
        const newPassword = document.getElementById('adminPassword').value;
        if (newPassword && newPassword.length >= 6) {
            // In a real application, you'd want to hash this password
            localStorage.setItem('adminPassword', newPassword);
            document.getElementById('adminPassword').value = '';
            this.showNotification('Admin password changed successfully!', 'success');
        } else {
            this.showNotification('Password must be at least 6 characters long', 'error');
        }
    }

    // Export data
    async exportData() {
        try {
            await firebasePortfolioManager.exportData();
            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Error exporting data!', 'error');
        }
    }

    // Import data
    async importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const jsonData = e.target.result;
                await firebasePortfolioManager.importData(jsonData);
                
                // Reload data and refresh UI
                await this.loadData();
                this.populateFormFields();
                this.renderSkills();
                this.renderProjects();
                this.renderJobs();
                
                this.showNotification('Data imported successfully!', 'success');
            } catch (error) {
                console.error('Error importing data:', error);
                this.showNotification('Error importing data!', 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    // Validate imported data
    validateImportedData(data) {
        const requiredFields = ['name', 'specializations', 'about', 'skills', 'projects', 'jobs', 'contactLinks'];
        return requiredFields.every(field => data.hasOwnProperty(field));
    }

    // Reset to default
    async resetToDefault() {
        if (confirm('Are you sure you want to reset all data to default? This action cannot be undone.')) {
            try {
                await firebasePortfolioManager.resetToDefault();
                
                // Reload data and refresh UI
                await this.loadData();
                this.populateFormFields();
                this.renderSkills();
                this.renderProjects();
                this.renderJobs();
                
                this.showNotification('Data reset to default successfully!', 'success');
            } catch (error) {
                console.error('Error resetting data:', error);
                this.showNotification('Error resetting data!', 'error');
            }
        }
    }

    // Clear localStorage and reload default data (for testing)
    clearAndReload() {
        if (confirm('This will clear all saved data and reload default values. Continue?')) {
            localStorage.removeItem('portfolioData');
            this.loadData();
            this.populateFormFields();
            this.renderSkills();
            this.renderProjects();
            this.renderJobs();
            this.showNotification('Data cleared and default values loaded!', 'info');
            this.updateStatus('Default data loaded');
        }
    }

    // Update status
    updateStatus(message = 'Ready') {
        document.getElementById('dataStatus').textContent = `Status: ${message}`;
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
        `;
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Get notification color
    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles); 