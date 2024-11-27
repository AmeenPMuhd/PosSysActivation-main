import { createConfirmation } from 'react-confirm';
import CustomDialog from './CustomDialog';

// create confirm function
export const confirm = createConfirmation(CustomDialog);

// This is optional. But wrapping function makes it easy to use.
export function confirmWrapper(confirmation, options = {}) {
  return confirm({ confirmation, options });
}