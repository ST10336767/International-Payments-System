# CircleCI and SonarCloud Setup Guide

This guide will help you set up CircleCI pipeline with SonarCloud integration to scan for security hotspots and code smells.

## Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **CircleCI Account**: Sign up at [circleci.com](https://circleci.com) and connect your GitHub account
3. **SonarCloud Account**: Sign up at [sonarcloud.io](https://sonarcloud.io) using your GitHub account (free for open source projects)

---

## Step 1: Set up SonarCloud

1. Go to [sonarcloud.io](https://sonarcloud.io) and sign in with GitHub
2. Click **"Create Project"** or **"Analyze a project"**
3. Choose **"GitHub"** as your organization
4. Select your repository
5. SonarCloud will create two projects automatically:
   - `insy-poe-backend`
   - `insy-poe-frontend`

6. **Get your Organization Key and Project Keys**:
   - Go to your project settings in SonarCloud
   - Note your **Organization Key** (looks like: `your-org-name`)
   - Note your **Project Keys** for both backend and frontend

7. **Generate a SonarCloud Token**:
   - Go to: **My Account** → **Security** → **Generate Token**
   - Name it: `CircleCI`
   - Copy the token (you'll need it for CircleCI)

---

## Step 2: Update SonarCloud Configuration Files

Update the following files with your actual SonarCloud organization and project keys:

### `INSY-POE-Backend/sonar-project.properties`

Replace `your-organization-key` with your actual SonarCloud organization key:

```properties
sonar.organization=your-organization-key
sonar.projectKey=insy-poe-backend
```

### `INSY-POE-Frontend/sonar-project.properties`

Replace `your-organization-key` with your actual SonarCloud organization key:

```properties
sonar.organization=your-organization-key
sonar.projectKey=insy-poe-frontend
```

---

## Step 3: Set up CircleCI

1. **Connect Repository to CircleCI**:
   - Go to [circleci.com](https://circleci.com)
   - Click **"Add Projects"** or **"Set Up Project"**
   - Find your repository and click **"Set Up Project"**
   - Choose **"Use existing config"** (since we already have `.circleci/config.yml`)

2. **Add SonarCloud Context**:
   - In CircleCI, go to **Organization Settings** → **Contexts**
   - Click **"Create Context"** and name it: `SonarCloud`
   - Add the following environment variable:
     - `SONAR_TOKEN`: Paste your SonarCloud token from Step 1
   - **Note**: The configuration uses the SonarCloud scanner directly (no orb required), so you don't need to enable uncertified orbs

3. **Verify Pipeline**:
   - Push your changes to GitHub
   - CircleCI will automatically detect the `.circleci/config.yml` file
   - Go to CircleCI dashboard to see your pipeline running

---

## Step 4: What the Pipeline Does

The CircleCI pipeline will:

1. **Backend Job**:
   - Install dependencies
   - Run ESLint
   - Run tests (if available) with coverage
   - Store coverage reports

2. **Frontend Job**:
   - Install dependencies
   - Run ESLint
   - Build the application
   - Store build artifacts

3. **SonarCloud Analysis** (Backend):
   - Scans backend code for:
     - **Security Hotspots**: Potential security vulnerabilities
     - **Code Smells**: Maintainability issues
     - **Bugs**: Code errors
     - **Coverage**: Test coverage metrics

4. **SonarCloud Analysis** (Frontend):
   - Scans frontend code for:
     - **Security Hotspots**: Potential security vulnerabilities
     - **Code Smells**: Maintainability issues
     - **Bugs**: Code errors

---

## Step 5: Viewing Results

### CircleCI
- Go to your CircleCI dashboard
- Click on your project
- View pipeline runs, logs, and artifacts

### SonarCloud
- Go to [sonarcloud.io](https://sonarcloud.io)
- Navigate to your projects
- View:
  - **Security Hotspots**: Security vulnerabilities that need review
  - **Code Smells**: Code quality issues
  - **Bugs**: Actual code errors
  - **Coverage**: Test coverage percentage
  - **Quality Gate**: Overall project health

---

## Troubleshooting

### Pipeline Fails
- Check CircleCI logs for error messages
- Ensure all environment variables are set correctly
- Verify SonarCloud token is valid

### SonarCloud Not Scanning
- Verify `SONAR_TOKEN` is set in CircleCI context (SonarCloud context)
- Check that project keys match in `sonar-project.properties`
- Ensure organization key is correct in `sonar-project.properties`
- Verify Java is installed (the pipeline installs it automatically)
- Check that the scanner downloaded successfully (check CircleCI logs)

### Coverage Reports Missing
- Tests need to generate LCOV format coverage
- Backend uses Jest with `--coverage` flag
- Frontend needs test setup (currently placeholder)

---

## Next Steps

1. **Add Tests**: Create test files to improve coverage
2. **Fix Issues**: Address security hotspots and code smells found by SonarCloud
3. **Quality Gate**: Configure SonarCloud quality gates to block merges if issues exceed thresholds
4. **Badges**: Add SonarCloud badges to your README

---

## Configuration Files

- `.circleci/config.yml` - CircleCI pipeline configuration
- `INSY-POE-Backend/sonar-project.properties` - SonarCloud backend config
- `INSY-POE-Frontend/sonar-project.properties` - SonarCloud frontend config

---

## Additional Resources

- [CircleCI Documentation](https://circleci.com/docs/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [SonarCloud Security Hotspots](https://docs.sonarcloud.io/user-guide/security-hotspots/)
- [SonarCloud Code Smells](https://docs.sonarcloud.io/user-guide/issues/)

