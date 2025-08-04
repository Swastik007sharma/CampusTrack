// Simple Google OAuth implementation using Google's JavaScript API

const GOOGLE_CLIENT_ID = '97263525307-170s9hhk5col55l6idcg2d2e1snkud2m.apps.googleusercontent.com';

// Load Google API script
export const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      if (window.google) {
        resolve(window.google);
      } else {
        reject(new Error('Google API failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Google API script'));
    document.head.appendChild(script);
  });
};

// Initialize Google Sign-In
export const initializeGoogleAuth = async () => {
  try {
    await loadGoogleScript();
    
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: () => {}, // Will be overridden
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to initialize Google Auth:', error);
    return false;
  }
};

// Sign in with Google
export const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google API not loaded'));
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: async (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }

        try {
          // Get user info using the access token
          const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`);
          const userInfo = await userResponse.json();
          
          resolve({
            accessToken: response.access_token,
            user: userInfo
          });
        } catch (error) {
          reject(error);
        }
      },
    });

    client.requestAccessToken();
  });
};
