# GitHub Secrets Setup Guide

This guide explains how to set up GitHub Secrets for CI/CD deployment.

## What are GitHub Secrets?

GitHub Secrets are encrypted environment variables that store sensitive information (passwords, API keys, etc.) securely. They're used in GitHub Actions workflows without exposing them in your code.

## Required Secrets for AWS Deployment

### 1. EC2_SSH_KEY
**What it is:** Your EC2 private key (.pem file) content

**How to get it:**
1. When you created EC2 instance, you downloaded `appointments-key.pem`
2. Open the file in a text editor
3. Copy the ENTIRE content (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

**How to add it:**
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `EC2_SSH_KEY`
5. Value: Paste the entire .pem file content
6. Click "Add secret"

### 2. EC2_HOST
**What it is:** Your EC2 instance public IP address

**How to get it:**
1. Go to AWS EC2 Console
2. Find your instance "appointments-backend"
3. Copy the "Public IPv4 address" (e.g., `54.123.45.67`)

**How to add it:**
1. GitHub repository → Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `EC2_HOST`
4. Value: Your EC2 public IP (just the IP, no http://)
5. Add secret

### 3. AWS_ACCESS_KEY_ID
**What it is:** AWS credentials for S3 deployment

**How to get it:**
1. Go to AWS Console → IAM
2. Users → Add users
3. User name: `github-actions-deploy`
4. Access type: Programmatic access
5. Permissions: Attach existing policies → `AmazonS3FullAccess`
6. Create user
7. **IMPORTANT:** Copy the "Access key ID" (you'll only see it once!)

**How to add it:**
1. GitHub → Settings → Secrets → New repository secret
2. Name: `AWS_ACCESS_KEY_ID`
3. Value: Paste the Access key ID
4. Add secret

### 4. AWS_SECRET_ACCESS_KEY
**What it is:** AWS secret key (paired with Access Key ID)

**How to get it:**
1. Same process as AWS_ACCESS_KEY_ID above
2. Copy the "Secret access key" when creating the IAM user

**How to add it:**
1. GitHub → Settings → Secrets → New repository secret
2. Name: `AWS_SECRET_ACCESS_KEY`
3. Value: Paste the Secret access key
4. Add secret

### 5. S3_BUCKET_NAME
**What it is:** Your S3 bucket name for frontend hosting

**How to get it:**
1. Go to AWS S3 Console
2. Find your bucket (e.g., `appointments-frontend-12345`)
3. Copy the bucket name

**How to add it:**
1. GitHub → Settings → Secrets → New repository secret
2. Name: `S3_BUCKET_NAME`
3. Value: Your bucket name (e.g., `appointments-frontend-12345`)
4. Add secret

## Verification Checklist

After adding all secrets, verify:

- [ ] EC2_SSH_KEY - Contains full .pem file content
- [ ] EC2_HOST - Contains EC2 public IP (no http://)
- [ ] AWS_ACCESS_KEY_ID - IAM user access key
- [ ] AWS_SECRET_ACCESS_KEY - IAM user secret key
- [ ] S3_BUCKET_NAME - S3 bucket name

## Testing the CI/CD Pipeline

1. Make a small change to your code (e.g., update README)
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Test CI/CD pipeline"
   git push origin main
   ```
3. Go to GitHub → Actions tab
4. Watch the workflow run
5. Check for any errors

## Common Issues

### "Permission denied (publickey)"
- **Problem:** EC2_SSH_KEY is incorrect
- **Solution:** Re-copy the entire .pem file content, including headers

### "Access Denied" on S3
- **Problem:** AWS credentials don't have S3 permissions
- **Solution:** Add `AmazonS3FullAccess` policy to IAM user

### "Host key verification failed"
- **Problem:** SSH strict host checking
- **Solution:** Already handled in workflow with `-o StrictHostKeyChecking=no`

## Security Best Practices

1. **Never commit secrets to code** - Always use GitHub Secrets
2. **Rotate keys regularly** - Change AWS keys every 90 days
3. **Use minimal permissions** - IAM user should only have S3 access
4. **Monitor access** - Check AWS CloudTrail for unusual activity

## For Render Deployment

Render doesn't need GitHub Secrets! It auto-deploys from GitHub and you configure environment variables in Render dashboard.

Just connect your GitHub repo to Render and it handles the rest.
