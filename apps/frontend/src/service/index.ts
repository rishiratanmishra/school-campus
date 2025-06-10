import { ST } from "next/dist/shared/lib/utils";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';

export const QUERY_KEYS = {
  USERS: 'users',
  ORGANISATION: 'organisation',
  STUDENTS: 'students',
};