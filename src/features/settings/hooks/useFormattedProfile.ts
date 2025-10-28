import { UserProfile } from './useProfile';

export interface FormattedUserProfile extends UserProfile {
  memberSince: string;
  displayName: string;
  roleDisplay: string;
  shortId: string;
}

export const useFormattedProfile = (user: UserProfile | null): FormattedUserProfile | null => {
  if (!user) return null;

  const formatMemberSince = (createdAt: string): string => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getRoleDisplay = (role: string): string => {
    return role === 'STUDENT' ? 'Estudiante' : 'Administrador';
  };

  const getDisplayName = (user: UserProfile): string => {
    return user.nombreCompleto || `${user.firstName} ${user.lastName}`.trim() || 'Usuario';
  };

  const getShortId = (id: string): string => {
    return `${id.slice(0, 8)}...`;
  };

  return {
    ...user,
    memberSince: formatMemberSince(user.createdAt),
    displayName: getDisplayName(user),
    roleDisplay: getRoleDisplay(user.role),
    shortId: getShortId(user.id)
  };
};

export default useFormattedProfile;