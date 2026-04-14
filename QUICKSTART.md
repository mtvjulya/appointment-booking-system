# Quick Start Guide - Cloud Deployment

## 🎯 Choose Your Deployment Path

### Path A: AWS (More Complex, Better Learning)
**Time:** ~60 minutes  
**Requirements:** Credit card, AWS account  
**Best for:** Learning AWS, production-like setup

### Path B: Render (Simple, Fast)
**Time:** ~15 minutes  
**Requirements:** GitHub account only  
**Best for:** Quick demo, no credit card needed

---

## 🚀 AWS Quick Start

### Prerequisites Checklist
- [ ] AWS account created
- [ ] Credit card added (won't be charged in free tier)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

### 5-Step AWS Deployment

**Step 1: Database (10 min)**
```
AWS Console → RDS → Create Database
- Engine: PostgreSQL 16
- Template: Free tier
- Instance: db.t2.micro
- DB name: appointments
- Save the endpoint URL!
```

**Step 2: Backend Server (15 min)**
```
AWS Console → EC2 → Launch Instance
- AMI: Amazon Linux 2023
- Type: t2.micro
- Download .pem key file
- Security group: Allow ports 22, 80, 8080
```

Connect and setup:
```bash
ssh -i appointments-key.pem ec2-user@[EC2-IP]
sudo yum install java-17-amazon-corretto-devel maven -y
git clone [YOUR-REPO]
cd YOUR-REPO/backend/appointments
# Update application.properties with RDS endpoint
mvn clean package -DskipTests
nohup java -jar target/appointments-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

**Step 3: Frontend Storage (10 min)**
```
AWS Console → S3 → Create Bucket
- Name: appointments-frontend-[random]
- Uncheck "Block all public access"
- Enable static website hosting
```

Upload frontend:
```bash
cd frontend
# Update src/services/api.js with EC2 IP
npm run build
# Upload dist/ folder to S3 via console
```

**Step 4: GitHub Secrets (5 min)**
```
GitHub Repo → Settings → Secrets → Add:
- EC2_SSH_KEY (content of .pem file)
- EC2_HOST (EC2 public IP)
- AWS_ACCESS_KEY_ID (create IAM user)
- AWS_SECRET_ACCESS_KEY (from IAM user)
- S3_BUCKET_NAME (your bucket name)
```

**Step 5: Test & Deploy (5 min)**
```bash
git add .
git commit -m "Deploy to AWS"
git push origin main
# Watch GitHub Actions → Actions tab
```

**Your app is live!**
- Backend: `http://[EC2-IP]:8080`
- Frontend: `http://[S3-BUCKET].s3-website-us-east-1.amazonaws.com`

---

## 🎨 Render Quick Start

### Prerequisites Checklist
- [ ] GitHub account
- [ ] Code pushed to GitHub
- [ ] Render account (sign up with GitHub)

### 3-Step Render Deployment

**Step 1: Create Database (2 min)**
```
Render Dashboard → New → PostgreSQL
- Name: appointments-db
- Region: Oregon (Free)
- Plan: Free
- Copy the "Internal Database URL"
```

**Step 2: Deploy Backend (5 min)**
```
Render Dashboard → New → Web Service
- Connect GitHub repo
- Root Directory: backend/appointments
- Build: mvn clean package -DskipTests
- Start: java -jar target/appointments-0.0.1-SNAPSHOT.jar

Environment Variables:
- SPRING_DATASOURCE_URL=[Internal DB URL]
- SPRING_DATASOURCE_USERNAME=appointments_user
- SPRING_DATASOURCE_PASSWORD=[from DB creation]
- SPRING_MAIL_USERNAME=[your-gmail]
- SPRING_MAIL_PASSWORD=[gmail-app-password]
```

**Step 3: Deploy Frontend (5 min)**
```
Update frontend/src/services/api.js:
baseURL: 'https://appointments-backend.onrender.com/api'

Render Dashboard → New → Static Site
- Root Directory: frontend
- Build: npm install --legacy-peer-deps && npm run build
- Publish: dist
```

**Your app is live!**
- Backend: `https://appointments-backend.onrender.com`
- Frontend: `https://appointments-frontend.onrender.com`

---

## 📋 What You Need to Update in Code

### Before AWS Deployment:
1. **frontend/src/services/api.js**
   ```javascript
   baseURL: 'http://[YOUR-EC2-IP]:8080/api'
   ```

2. **backend/.../application.properties**
   ```properties
   spring.datasource.url=jdbc:postgresql://[RDS-ENDPOINT]:5432/appointments
   spring.datasource.username=postgres
   spring.datasource.password=[YOUR-PASSWORD]
   ```

### Before Render Deployment:
1. **frontend/src/services/api.js**
   ```javascript
   baseURL: 'https://appointments-backend.onrender.com/api'
   ```

2. Environment variables set in Render dashboard (not in code!)

---

## ✅ Testing Your Deployment

After deployment, test these features:

1. **Homepage loads** - Visit frontend URL
2. **Services page** - Click "Book an appointment"
3. **User registration** - Enter email, receive verification code
4. **Book appointment** - Complete booking flow
5. **Admin login** - Go to `/admin/login`, use password: `admin123`
6. **Email notifications** - Check if emails are sent

---

## 🐛 Troubleshooting

### AWS Issues

**Backend won't start:**
```bash
ssh -i appointments-key.pem ec2-user@[EC2-IP]
tail -f app.log  # Check error logs
```

**Can't connect to database:**
- Check RDS security group allows EC2 IP
- Verify database endpoint in application.properties

**Frontend shows CORS error:**
- Create WebConfig.java (see DEPLOYMENT.md)
- Restart backend

### Render Issues

**Service is slow:**
- Normal! Free tier sleeps after 15 min inactivity
- First request takes ~30 seconds to wake up

**Build fails:**
- Check build logs in Render dashboard
- Common issue: Missing `--legacy-peer-deps` flag

**Database connection error:**
- Verify environment variables in Render dashboard
- Check Internal Database URL is correct

---

## 💰 Cost Breakdown

### AWS Free Tier (12 months):
- EC2 t2.micro: FREE (750 hours/month)
- RDS db.t2.micro: FREE (750 hours/month)
- S3: FREE (5GB storage)
- **Total: $0/month** (if you stay in limits)

**After 12 months:** ~$15-20/month

### Render Free Tier:
- PostgreSQL: FREE forever
- Web Service: FREE forever
- Static Site: FREE forever
- **Total: $0/month forever**

**Limitations:** Services sleep after 15 min, slower performance

---

## 🎓 Recommendation

**Try this order:**

1. **Start with AWS** (1 hour attempt)
   - Great learning experience
   - Looks better on CV
   - More production-like

2. **If AWS is too complex → Switch to Render** (15 min)
   - Much simpler
   - Still fully functional
   - Perfect for demo

3. **Best of both worlds:**
   - Deploy on Render for quick demo
   - Learn AWS setup on the side
   - Migrate to AWS later if needed

---

## 📚 Full Documentation

- **Detailed AWS Guide:** See `DEPLOYMENT.md`
- **GitHub Secrets Setup:** See `.github/SECRETS_SETUP.md`
- **CI/CD Workflows:** See `.github/workflows/`

---

## 🎯 Next Steps After Deployment

1. Test all features thoroughly
2. Share the URL with friends/testers
3. Monitor logs for errors
4. Add custom domain (optional)
5. Enable HTTPS (AWS Certificate Manager or Render auto-HTTPS)

**Good luck with deployment! 🚀**
