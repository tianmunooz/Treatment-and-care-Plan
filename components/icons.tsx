

import React from 'react';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Download,
  Mail,
  Mic,
  Sparkles,
  GripVertical,
  User,
  Calendar,
  FileEdit,
  Save,
  Eye,
  Share2,
  ClipboardList,
  Syringe,
  Package,
  Clock,
  Smile,
  X,
  Check,
  Beaker,
  Phone,
  Globe,
  CheckSquare,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Settings,
  Sun,
  Droplets,
  Vegan,
  CigaretteOff,
  WineOff,
  Home,
  ListChecks,
  DollarSign,
  Landmark,
  Percent,
  FileText,
  Palette,
  LayoutTemplate,
  Building,
  Wrench,
  MessageCircle,
  Languages,
  Search,
  ListFilter,
  Image,
  Briefcase,
  ArrowUp,
  LayoutGrid,
  List
} from 'lucide-react';

export const PlusIcon = Plus;
export const TrashIcon = Trash2;
export const ArrowLeftIcon = ArrowLeft;
export const DownloadIcon = Download;
export const MailIcon = Mail;
export const MicrophoneIcon = Mic;
export const SparkleIcon = Sparkles;
export const DragHandleIcon = GripVertical;
export const UserIcon = User;
export const CalendarIcon = Calendar;
export const EditIcon = FileEdit;
export const SaveIcon = Save;
export const EyeIcon = Eye;
export const ShareIcon = Share2;
export const TreatmentPlanIcon = ClipboardList;
export const SyringeIcon = Syringe;
export const PackageIcon = Package;
export const ClockIcon = Clock;
export const FacialIcon = Smile;
export const CancelIcon = X;
export const CheckIcon = Check;
export const VialIcon = Beaker;
export const PhoneIcon = Phone;
export const GlobeIcon = Globe;
export const CheckSquareIcon = CheckSquare;
export const AlertTriangleIcon = AlertTriangle;
export const ChevronUpIcon = ChevronUp;
export const ChevronDownIcon = ChevronDown;
export const SettingsIcon = Settings;
export const SunIcon = Sun;
export const DropletsIcon = Droplets;
export const VeganIcon = Vegan;
export const CigaretteOffIcon = CigaretteOff;
export const WineOffIcon = WineOff;
export const HomeIcon = Home;
export const ListChecksIcon = ListChecks;
export const DollarSignIcon = DollarSign;
export const LandmarkIcon = Landmark;
export const PercentIcon = Percent;
export const FileTextIcon = FileText;
export const PaletteIcon = Palette;
export const TemplateIcon = LayoutTemplate;
export const BuildingIcon = Building;
export const WrenchIcon = Wrench;
export const MessageCircleIcon = MessageCircle;
export const LanguagesIcon = Languages;
export const SearchIcon = Search;
export const ListFilterIcon = ListFilter;
export const ImageIcon = Image;
export const BriefcaseIcon = Briefcase;
export const ArrowUpIcon = ArrowUp;
export const LayoutGridIcon = LayoutGrid;
export const ListIcon = List;


export const A360Logo: React.FC<{ logoUrl?: string, className?: string }> = ({ logoUrl, className }) => {
  if (logoUrl) {
    return <img src={logoUrl} alt="Practice Logo" className={`w-auto object-contain ${className || ''}`} crossOrigin="anonymous" />;
  }
  
  return (
    <img src="https://ik.imagekit.io/0fheaxmfc/Main%20Logo.png?updatedAt=1754492000386" alt="Practice Logo" className={`w-auto object-contain ${className || ''}`} crossOrigin="anonymous" />
  );
};