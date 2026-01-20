import React from 'react';
import { Input } from './Input';

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const DatePicker: React.FC<DatePickerProps> = ({ ...props }) => {
  return <Input type="date" {...props} />;
};
