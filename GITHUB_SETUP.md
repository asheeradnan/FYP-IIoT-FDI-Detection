# GitHub Setup Guide

## Step 1: Create GitHub Repository

1. Go to **https://github.com** and login
2. Click the **"+"** icon → **"New repository"**
3. Fill in the details:
   - **Repository name:** `FYP-IIoT-FDI-Detection` (or your preferred name)
   - **Description:** `FDI Attack Detection in IIoT using Deep Q-Learning & GNN`
   - **Visibility:** 
     - ✅ **Private** (Recommended for FYP) - Only you and collaborators can see it
     - OR **Public** - Anyone can see it
   - **DON'T** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 2: Configure Git (First Time Only)

If you haven't set up Git before, run these commands:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Connect Local Repository to GitHub

After creating the GitHub repository, you'll see instructions. Run these commands:

```powershell
# Add the remote repository (replace with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/FYP-IIoT-FDI-Detection.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git push -u origin main
```

If you get an error about `master` vs `main`, rename the branch:
```powershell
git branch -M main
git push -u origin main
```

## Step 4: Authenticate with GitHub

When you push for the first time, GitHub will ask for authentication:

### Option A: Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: `FYP-IIoT-Project`
4. Select scopes: ✅ `repo` (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. When git asks for password, paste this token

### Option B: GitHub CLI
```powershell
# Install GitHub CLI from: https://cli.github.com/
gh auth login
```

## Step 5: Add Team Members as Collaborators

1. Go to your repository on GitHub
2. Click **Settings** → **Collaborators**
3. Click **"Add people"**
4. Enter your team member's GitHub username or email
5. Select their permission level:
   - **Read** - Can only view
   - **Write** - Can push changes (recommended for team members)
   - **Admin** - Full access

## Step 6: Team Members Clone the Repository

Your team members should run:

```powershell
git clone https://github.com/YOUR_USERNAME/FYP-IIoT-FDI-Detection.git
cd FYP-IIoT-FDI-Detection
```

Then follow the setup instructions in the README.md

## Daily Git Workflow

### Before Starting Work
```powershell
# Get latest changes from team
git pull origin main
```

### After Making Changes
```powershell
# Check what changed
git status

# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Description of what you changed"

# Push to GitHub
git push origin main
```

## Common Git Commands

```powershell
# View commit history
git log --oneline

# Check current status
git status

# See what changed in files
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes (CAREFUL!)
git reset --hard HEAD

# Create a new branch for a feature
git checkout -b feature/new-feature

# Switch between branches
git checkout main
git checkout feature/new-feature

# Merge feature branch into main
git checkout main
git merge feature/new-feature
```

## Best Practices

✅ **Commit Often** - Small, frequent commits are better than large ones
✅ **Write Clear Messages** - Describe what changed and why
✅ **Pull Before Push** - Always get latest changes before pushing
✅ **Don't Commit Secrets** - `.env` file is already in .gitignore
✅ **Use Branches** - Create feature branches for major changes
✅ **Review Before Commit** - Use `git status` and `git diff`

## Useful Commit Message Format

```
Type: Brief description

- Detail 1
- Detail 2

Examples:
- feat: Add user login endpoint
- fix: Resolve database connection error
- docs: Update README with setup instructions
- refactor: Improve model loading performance
```

## Troubleshooting

### Error: "fatal: remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### Error: "Updates were rejected"
```powershell
# Pull changes first, then push
git pull origin main --rebase
git push origin main
```

### Merge Conflicts
1. Git will mark conflicting files
2. Open files and look for `<<<<<<<` markers
3. Resolve conflicts manually
4. Stage resolved files: `git add .`
5. Complete merge: `git commit`

## Repository URL Format

- **HTTPS:** `https://github.com/USERNAME/REPO_NAME.git`
- **SSH:** `git@github.com:USERNAME/REPO_NAME.git` (requires SSH key setup)

---

**Quick Start Command Sequence:**

```powershell
# After creating GitHub repository, run:
git remote add origin https://github.com/YOUR_USERNAME/FYP-IIoT-FDI-Detection.git
git branch -M main
git push -u origin main
```

Your code is now safely backed up on GitHub! 🎉
