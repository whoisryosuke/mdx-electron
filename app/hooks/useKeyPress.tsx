import { useEffect } from 'react';

export default function useKeyPress(targetKey, action) {
  // Add event listeners
  useEffect(() => {
    // If pressed key is our target key then run action
    function downHandler({ key }) {
      if (key === targetKey) {
        action();
      }
    }
    window.addEventListener('keydown', downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [action, targetKey]); // Empty array ensures that effect is only run on mount and unmount
}
