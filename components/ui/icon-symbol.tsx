import React from 'react';
import { 
  HelpCircle, 
  Home, 
  PieChart, 
  User, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Utensils, 
  Car, 
  Gamepad2, 
  HeartPulse, 
  ShoppingBag, 
  Banknote, 
  GraduationCap, 
  ReceiptText, 
  MoreHorizontal,
  ChevronDown,
  Calendar,
  Clock,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  FileText,
  ChevronRight,
  CircleHelp,
  Globe,
  Database,
  Target,
  Wallet
} from 'lucide-react-native';

import { OpaqueColorValue, type StyleProp, type ViewStyle } from 'react-native';

const ICONS: Record<string, any> = {
  HelpCircle,
  Home,
  PieChart,
  User,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Utensils,
  Car,
  Gamepad2,
  HeartPulse,
  ShoppingBag,
  Banknote,
  GraduationCap,
  ReceiptText,
  MoreHorizontal,
  ChevronDown,
  Calendar,
  Clock,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  FileText,
  ChevronRight,
  CircleHelp,
  Globe,
  Database,
  Target,
  Wallet
};

/**
 * An icon component that uses Lucide icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  const IconComponent = ICONS[name] || HelpCircle;
  
  return <IconComponent color={color} size={size} style={style} />;
}
