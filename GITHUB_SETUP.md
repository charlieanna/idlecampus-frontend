# GitHub Repository Setup Guide

This guide will help you create a new GitHub repository for IdleCampus and push all your Progressive Flow work.

## Prerequisites

- GitHub account
- Git installed locally
- GitHub CLI (optional, for easier setup)

## Option 1: Using GitHub Web Interface (Recommended)

### Step 1: Create Repository on GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top-right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `idlecampus`
   - **Description**: `Interactive learning platform for system design with progressive gamification`
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### Step 2: Push Local Repository to GitHub

GitHub will show you commands. Use these instead (they preserve our work):

```bash
# Navigate to the frontend directory
cd /Users/ankurkothari/Documents/workspace/idlecampus/frontend

# Stage all new Progressive Flow files
git add .

# Commit the Progressive Flow implementation
git commit -m "feat: Add Progressive Flow system with Rails backend

- Add 61 system design challenges across 3 learning tracks
- Implement 5-level progression system (L1-L5)
- Create Rails backend with PostgreSQL
- Add gamification: XP, achievements, leaderboards, skill tree
- Include comprehensive seed data
- Add development startup script
- Configure frontend to use backend API"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/idlecampus.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/idlecampus.git

# Push to GitHub
git push -u origin master
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## Option 2: Using GitHub CLI (Faster)

If you have GitHub CLI installed:

```bash
# Navigate to the frontend directory
cd /Users/ankurkothari/Documents/workspace/idlecampus/frontend

# Stage and commit all changes
git add .
git commit -m "feat: Add Progressive Flow system with Rails backend"

# Create GitHub repo and push (interactive)
gh repo create idlecampus --public --source=. --push

# Or for private:
# gh repo create idlecampus --private --source=. --push
```

---

## What Will Be Pushed

### ✅ Frontend Files
- React Progressive Flow UI (`src/apps/system-design/progressive/`)
- All pages, components, services
- Documentation (PROGRESSIVE_FLOW_*.md files)
- Development startup script (`start-dev.sh`)
- Updated `.env` with backend configuration

### ✅ Backend Files  
- Rails backend in `../backend/` directory
- Database migrations (17 tables)
- ActiveRecord models
- API controllers and routes
- Service classes (XP, achievements, skills, leaderboards)
- Comprehensive seed data (`db/seeds/progressive_flow_seeds.rb`)
- Rake tasks

### ✅ Documentation
- `PROGRESSIVE_FLOW_DATABASE_SCHEMA.md` - Complete database schema
- `PROGRESSIVE_FLOW_WIREFRAMES.md` - UI wireframes
- `PROGRESSIVE_FLOW_IMPLEMENTATION_PLAN.md` - Development roadmap
- `GAMIFICATION_FORMULAS.md` - XP and level formulas
- `README_PROGRESSIVE_FLOW_API.md` - API documentation
- And more...

---

## Verify Repository Structure

After pushing, your GitHub repository should have this structure:

```
idlecampus/
├── frontend/                           # Main directory (root of repo)
│   ├── src/
│   │   ├── apps/system-design/progressive/   # Progressive Flow UI
│   │   └── ...
│   ├── backend/                       # Rails backend (separate dir)
│   │   ├── db/
│   │   │   ├── migrate/              # 6 migration files
│   │   │   └── seeds/
│   │   │       └── progressive_flow_seeds.rb
│   │   ├── app/
│   │   │   ├── models/               # 4 model files
│   │   │   ├── controllers/api/v1/   # 6 controllers
│   │   │   └── services/             # 5 service classes
│   │   └── config/routes.rb
│   ├── start-dev.sh                  # Startup script
│   ├── PROGRESSIVE_FLOW_*.md         # Documentation
│   └── README.md
```

---

## Post-Push Checklist

After successfully pushing to GitHub:

- [ ] Verify all files are visible on GitHub
- [ ] Check that the Rails backend directory is included
- [ ] Update README.md with setup instructions
- [ ] Add GitHub Actions for CI/CD (optional)
- [ ] Configure environment variables in GitHub Secrets (for deployment)

---

## Updating README.md for GitHub

Consider adding this section to your main README.md:

```markdown
## Progressive Flow System

IdleCampus includes a gamified progressive learning system for system design:

- **61 Challenges** across 3 learning tracks
- **5 Levels per Challenge** (Connectivity → Capacity → Optimization → Resilience → Excellence)
- **Full Backend** with Rails + PostgreSQL
- **Gamification**: XP, levels, achievements, leaderboards, skill tree

### Quick Start

```bash
./start-dev.sh
```

This starts both frontend (Vite) and backend (Rails) servers.

Visit: http://localhost:5173/system-design/progressive/dashboard

For more details, see [PROGRESSIVE_FLOW_QUICKSTART.md](PROGRESSIVE_FLOW_QUICKSTART.md)
```

---

## Common Issues

### Issue: Remote already exists
```bash
# Remove the existing remote
git remote remove origin

# Add your new GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/idlecampus.git
```

### Issue: Authentication failed
```bash
# For HTTPS, use a Personal Access Token instead of password
# Generate one at: https://github.com/settings/tokens

# Or switch to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/idlecampus.git
```

### Issue: Files too large
```bash
# Check for large files
find . -type f -size +100M

# Add large files to .gitignore
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore
```

---

## Next Steps After Pushing

1. **Add Repository Description** on GitHub
2. **Add Topics/Tags**: `system-design`, `progressive-learning`, `gamification`, `rails`, `react`
3. **Enable GitHub Pages** (if you want to host docs)
4. **Set Up GitHub Actions** for automated testing
5. **Add Contributors** if working with a team
6. **Create Project Board** for tracking development

---

## Manual Git Commands Reference

If the above doesn't work, here's the full manual process:

```bash
# 1. Navigate to project
cd /Users/ankurkothari/Documents/workspace/idlecampus/frontend

# 2. Check current status
git status

# 3. Stage all changes
git add .

# 4. Commit with descriptive message
git commit -m "feat: Add Progressive Flow system with Rails backend"

# 5. Check current remotes
git remote -v

# 6. Add GitHub remote (if not exists)
git remote add origin https://github.com/YOUR_USERNAME/idlecampus.git

# 7. Push to GitHub
git push -u origin master

# If master is now called main on GitHub:
# git push -u origin master:main
```

---

## Need Help?

- GitHub CLI: https://cli.github.com/
- GitHub Docs: https://docs.github.com/
- Git Documentation: https://git-scm.com/doc

---

**Ready to push to GitHub!** Just follow Option 1 or Option 2 above.