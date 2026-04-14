# Deployment Guide - AWS & Render

## 📋 What You Need for Cloud Deployment

### Required Accounts
1. **GitHub Account** - for code repository and CI/CD
2. **AWS Account** - for cloud hosting (requires credit card, but free tier available)
3. **Gmail Account** - for email service (already configured)

### Required Information
- Database credentials (will be created during setup)
- Email credentials (already in application.properties)
- Domain name (optional, AWS provides free subdomain)

---

## 🚀 Option 1: AWS Free Tier Deployment

### Architecture Overview
```
┌─────────────────┐
│   GitHub Repo   │
│   (Your Code)   │
└────────┬────────┘
         │ Push code
         ▼
┌─────────────────┐
│ GitHub Actions  │
│   (CI/CD)       │
└────────┬────────┘
         │ Deploy
         ▼
┌─────────────────────────────────────┐
│           AWS Cloud                 │
│  ┌──────────────┐  ┌─────────────┐ │
│  │   EC2        │  │    RDS      │ │
│  │ Spring Boot  │──│ PostgreSQL  │ │
│  │   Backend    │  │  Database   │ │
│  └──────────────┘  └─────────────┘ │
│  ┌──────────────┐                  │
│  │   S3 Bucket  │                  │
│  │React Frontend│                  │
│  └──────────────┘                  │
└─────────────────────────────────────┘
```

### Step-by-Step AWS Setup

#### Phase 1: AWS Account Setup (5 minutes)

1. **Create AWS Account**
   - Go to https://aws.amazon.com/free/
   - Click "Create a Free Account"
   - Enter email, password, account name
   - **Important:** You'll need a credit card (won't be charged if you stay in free tier)
   - Choose "Personal" account type
   - Complete phone verification

2. **Enable Free Tier Services**
   - EC2: t2.micro (750 hours/month for 12 months)
   - RDS: db.t2.micro PostgreSQL (750 hours/month for 12 months)
   - S3: 5GB storage

#### Phase 2: Database Setup - RDS PostgreSQL (15 minutes)

1. **Open RDS Console**
   - Go to AWS Console → Services → RDS
   - Click "Create database"

2. **Database Configuration**
   ```
   Engine: PostgreSQL 16
   Template: Free tier
   DB Instance Identifier: appointments-db
   Master username: postgres
   Master password: [Create strong password - SAVE THIS!]
   
   Instance: db.t2.micro
   Storage: 20 GB (free tier limit)
   
   VPC: Default VPC
   Public access: Yes (for now)
   VPC Security Group: Create new → appointments-db-sg
   
   Database name: appointments
   Port: 5432
   ```

3. **Security Group Configuration**
   - After creation, go to Security Groups
   - Find `appointments-db-sg`
   - Edit Inbound Rules:
     - Type: PostgreSQL
     - Port: 5432
     - Source: 0.0.0.0/0 (for testing - restrict later!)

4. **Get Database Endpoint**
   - Wait 5-10 minutes for database to be created
   - Copy the "Endpoint" (looks like: `appointments-db.xxxxx.us-east-1.rds.amazonaws.com`)
   - **SAVE THIS** - you'll need it for backend configuration

#### Phase 3: Backend Setup - EC2 Instance (20 minutes)

1. **Launch EC2 Instance**
   - Go to EC2 Console → Launch Instance
   
   ```
   Name: appointments-backend
   AMI: Amazon Linux 2023
   Instance type: t2.micro (Free tier eligible)
   
   Key pair: Create new key pair
     - Name: appointments-key
     - Type: RSA
     - Format: .pem
     - DOWNLOAD AND SAVE THIS FILE!
   
   Network settings:
     - VPC: Default
     - Auto-assign public IP: Enable
     - Security group: Create new
       - Name: appointments-backend-sg
       - Rules:
         * SSH (22) - Your IP
         * HTTP (80) - Anywhere
         * Custom TCP (8080) - Anywhere
   
   Storage: 8 GB gp3 (free tier)
   ```

2. **Connect to EC2 Instance**
   
   **Windows (PowerShell):**
   ```powershell
   # Navigate to where you saved the .pem file
   cd Downloads
   
   # Set permissions (if needed)
   icacls appointments-key.pem /inheritance:r
   icacls appointments-key.pem /grant:r "%username%":"(R)"
   
   # Connect via SSH
   ssh -i appointments-key.pem ec2-user@[YOUR-EC2-PUBLIC-IP]
   ```

3. **Install Java 17 on EC2**
   ```bash
   # Update system
   sudo yum update -y
   
   # Install Java 17
   sudo yum install java-17-amazon-corretto-devel -y
   
   # Verify installation
   java -version
   ```

4. **Install Maven**
   ```bash
   sudo yum install maven -y
   mvn -version
   ```

5. **Upload Backend Code**
   
   **Option A: Using Git (Recommended)**
   ```bash
   # On EC2 instance
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   cd YOUR-REPO/backend/appointments
   ```
   
   **Option B: Using SCP (from your local machine)**
   ```powershell
   # On your Windows machine
   scp -i appointments-key.pem -r "e:\final project\Appointment Booking System\backend\appointments" ec2-user@[EC2-IP]:~/
   ```

6. **Configure Database Connection**
   ```bash
   # On EC2 instance
   cd ~/YOUR-REPO/backend/appointments
   nano src/main/resources/application.properties
   ```
   
   Update these lines:
   ```properties
   spring.datasource.url=jdbc:postgresql://[RDS-ENDPOINT]:5432/appointments
   spring.datasource.username=postgres
   spring.datasource.password=[YOUR-RDS-PASSWORD]
   ```

7. **Build and Run Backend**
   ```bash
   # Build the application
   mvn clean package -DskipTests
   
   # Run the application
   java -jar target/appointments-0.0.1-SNAPSHOT.jar
   
   # Or run in background
   nohup java -jar target/appointments-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
   ```

8. **Test Backend**
   - Open browser: `http://[EC2-PUBLIC-IP]:8080/api/services`
   - Should see JSON response with services

#### Phase 4: Frontend Setup - S3 + CloudFront (15 minutes)

1. **Create S3 Bucket**
   - Go to S3 Console → Create bucket
   ```
   Bucket name: appointments-frontend-[random-number]
   Region: us-east-1
   
   Block Public Access: UNCHECK all boxes
   (We need public access for website hosting)
   
   Bucket Versioning: Disable
   ```

2. **Enable Static Website Hosting**
   - Select your bucket → Properties
   - Scroll to "Static website hosting"
   - Enable it:
     ```
     Index document: index.html
     Error document: index.html
     ```
   - **SAVE the endpoint URL** (e.g., `http://appointments-frontend-123.s3-website-us-east-1.amazonaws.com`)

3. **Set Bucket Policy**
   - Go to Permissions → Bucket Policy
   - Add this policy (replace BUCKET-NAME):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::BUCKET-NAME/*"
       }
     ]
   }
   ```

4. **Build and Upload Frontend**
   
   **On your local machine:**
   ```bash
   cd "e:\final project\Appointment Booking System\frontend"
   
   # Update API URL in src/services/api.js
   # Change baseURL to: http://[EC2-PUBLIC-IP]:8080/api
   
   # Build production version
   npm run build
   ```

5. **Upload to S3**
   
   **Option A: AWS Console**
   - Go to your S3 bucket → Upload
   - Drag all files from `dist/` folder
   - Click Upload

   **Option B: AWS CLI** (if installed)
   ```bash
   aws s3 sync dist/ s3://appointments-frontend-[number]/ --delete
   ```

6. **Test Frontend**
   - Open the S3 website endpoint URL
   - Should see your application!

#### Phase 5: Configure CORS (Important!)

On EC2 instance, update backend CORS configuration:

```bash
nano ~/YOUR-REPO/backend/appointments/src/main/java/ie/gov/appointments/config/WebConfig.java
```

Create this file if it doesn't exist:
```java
package ie.gov.appointments.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://appointments-frontend-*.s3-website-us-east-1.amazonaws.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
```

Rebuild and restart:
```bash
mvn clean package -DskipTests
pkill -f appointments
nohup java -jar target/appointments-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

---

## 🎯 Option 2: Render Deployment (Backup Plan)

### Step-by-Step Render Setup

#### Phase 1: Create Render Account (2 minutes)
1. Go to https://render.com
2. Sign up with GitHub
3. No credit card required!

#### Phase 2: Create PostgreSQL Database (3 minutes)
1. Dashboard → New → PostgreSQL
   ```
   Name: appointments-db
   Database: appointments
   User: appointments_user
   Region: Oregon (Free)
   Plan: Free
   ```
2. Wait 2 minutes for creation
3. **SAVE** the "Internal Database URL"

#### Phase 3: Deploy Backend (5 minutes)
1. Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   ```
   Name: appointments-backend
   Region: Oregon (Free)
   Branch: main
   Root Directory: backend/appointments
   Runtime: Java
   Build Command: mvn clean package -DskipTests
   Start Command: java -jar target/appointments-0.0.1-SNAPSHOT.jar
   Plan: Free
   ```
4. Add Environment Variables:
   ```
   SPRING_DATASOURCE_URL=[Internal Database URL from step 2]
   SPRING_DATASOURCE_USERNAME=appointments_user
   SPRING_DATASOURCE_PASSWORD=[from database creation]
   SPRING_MAIL_USERNAME=[your-gmail]
   SPRING_MAIL_PASSWORD=[your-gmail-app-password]
   ```
5. Click "Create Web Service"
6. **SAVE** the service URL (e.g., `https://appointments-backend.onrender.com`)

#### Phase 4: Deploy Frontend (5 minutes)
1. Update `frontend/src/services/api.js`:
   ```javascript
   baseURL: 'https://appointments-backend.onrender.com/api'
   ```
2. Dashboard → New → Static Site
3. Connect repository
4. Configure:
   ```
   Name: appointments-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
5. Click "Create Static Site"

**Done! Your app is live!** 🎉

---

## 📊 Comparison

| Feature | AWS Free Tier | Render Free |
|---------|--------------|-------------|
| **Setup Time** | 60 minutes | 15 minutes |
| **Complexity** | High | Low |
| **Free Duration** | 12 months | Forever |
| **Performance** | Better | Good (sleeps after 15min) |
| **Learning Value** | High (AWS skills) | Medium |
| **Requires Card** | Yes | No |

---

## 🔧 What You Need to Change in Code

### For AWS:
1. `frontend/src/services/api.js` - Update baseURL to EC2 IP
2. `backend/.../application.properties` - Update database URL
3. Create `WebConfig.java` for CORS

### For Render:
1. `frontend/src/services/api.js` - Update baseURL to Render URL
2. Environment variables in Render dashboard

---

## 🚨 Common Issues & Solutions

### AWS Issues:

**Problem:** Can't connect to RDS
- **Solution:** Check Security Group allows your IP on port 5432

**Problem:** Backend won't start
- **Solution:** Check `app.log` file: `tail -f app.log`

**Problem:** Frontend shows CORS error
- **Solution:** Add WebConfig.java and restart backend

### Render Issues:

**Problem:** Service is slow on first request
- **Solution:** Normal - free tier sleeps after 15 minutes

**Problem:** Build fails
- **Solution:** Check build logs in Render dashboard

---

## 📝 Next Steps After Deployment

1. **Test all features:**
   - User registration
   - Booking appointments
   - Admin login
   - Email notifications

2. **Security improvements:**
   - Restrict RDS security group to EC2 IP only
   - Use environment variables for secrets
   - Enable HTTPS (use AWS Certificate Manager)

3. **Monitoring:**
   - Set up CloudWatch alarms (AWS)
   - Check Render logs regularly

---

## 💡 Recommendation

**For learning AWS:** Start with AWS, it's more complex but valuable experience.

**For quick demo:** Use Render, it's much faster to set up.

**Best approach:** Try AWS first. If you encounter issues after 1 hour, switch to Render as backup.

---

## 📞 Need Help?

Common commands for troubleshooting:

**AWS EC2:**
```bash
# Check if backend is running
ps aux | grep java

# View logs
tail -f app.log

# Restart backend
pkill -f appointments
nohup java -jar target/appointments-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

**Render:**
- Check logs in dashboard
- Redeploy: Manual Deploy → Clear build cache & deploy
