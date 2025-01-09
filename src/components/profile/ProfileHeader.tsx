import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { User } from 'firebase/auth';

interface ProfileUser extends User {
  displayName: string | null;
}

export default function ProfileHeader({ user }: { user: ProfileUser }) {
  const { user: currentUser } = useAuth();

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-hennyPenny text-white">
          {user.displayName || 'Anonim Kullanıcı'}
        </h1>
        {currentUser?.isAdmin && (
          <div 
            className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded-lg"
            title="Admin Kullanıcı"
          >
            <FaShieldAlt className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-risque text-amber-500">Admin</span>
          </div>
        )}
      </div>
    </div>
  );
} 