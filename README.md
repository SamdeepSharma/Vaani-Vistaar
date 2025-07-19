# Vaani Vistaar

## Overview
Vaani Vistaar is an advanced AI-powered translation platform designed to facilitate seamless translation across multiple formats, including text documents, audio files, and video content. The platform supports translation services in a wide range of regional languages as well as the official languages of India.

### Features
- **Multi-Format Translation**: Supports text, audio, and video translations.
- **Real-Time AI-Powered Translations**: Leverages advanced machine learning algorithms to provide instant translations.
- **Continuous Learning**: AI and ML models improve translation accuracy over time.
- **Scalability**: Designed for high-performance translation workloads.

## Installation
### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (>= 18.x.x)
- **MongoDB**
- **Firebase SDK** (for authentication and storage)
- **Next.js 14**
- **Python** (for ML models, if applicable)

### Steps to Install
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vaani-vistaar.git
cd vaani-vistaar
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and configure the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   EMAIL_USERNAME=your_email_username
   EMAIL_PASSWORD=your_email_password
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_pass
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_FROM=your_email_from
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=your_nextauth_url
   EMAIL_SECURE=your_email_secure_setting
   NEXT_PUBLIC_MAX_AUDIO_SIZE=your_max_audio_size
   GOOGLE_APPLICATION_CREDENTIALS=your_google_application_credentials
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Usage
- **Sign up and log in** using Firebase authentication.
- **Upload text, audio, or video** for translation.
- **Choose source and target languages** and initiate translation.
- **Download the translated output** in various formats.

## Deployment
Vaani Vistaar can be deployed using **Vercel** or **Docker**.

### Deploy with Vercel
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```

### Deploy with Docker
1. Build the Docker image:
   ```bash
   docker build -t vaani-vistaar .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 vaani-vistaar
   ```

## Contributing
Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit your changes and push:
   ```bash
   git commit -m "Add new feature"
   git push origin feature-branch
   ```
4. Open a pull request.

## License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it.

## Contact
For questions or support, open an issue on GitHub or contact us via email at `sharmasamdeep1@gmail.com`.
