import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.description}>Oops! The page you're looking for doesn’t exist.</p>
      <div className={styles.buttonWrapper}>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
