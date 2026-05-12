export const API_BASE_URL = 'http://localhost:9090';
export const API_ENDPOINT = '/api';

export interface AuthUser {
  userId: number;
  role: string;
  pharmacieId: number;
  sub: string;
  iat: number;
  exp: number;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jwt_token', token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jwt_token');
}

export function getAuthUser(): AuthUser | null {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}


/**
 * Helper to fetch data with automatic authorization header
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Ensure endpoint starts with / if it's a relative path and not a full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Optional: Trigger logout or redirect to login
    removeAuthToken();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  return response;
}

// ======================== AUTH SERVICES ========================

export async function login(email: string, password: string) {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  pharmacyName: string;
  pharmacyAddress: string;
  phoneNumber: string;
}) {
  const response = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}


export async function initSuperAdmin(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  pharmacyName: string;
  pharmacyAddress: string;
  phoneNumber: string;
  initSecret: string;
}) {
  const response = await apiFetch('/superadmin/init', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

// ======================== PHARMACY SERVICES ========================

export async function createPharmacy(data: {
  nom: string;
  adresse: string;
  telephone: string;
  tenantId: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/pharmacies`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function listPharmacies() {
  const response = await apiFetch(`${API_ENDPOINT}/pharmacies`);
  return response.json();
}

export async function getPharmacyById(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/pharmacies/${id}`);
  return response.json();
}

export async function updatePharmacy(id: string, data: {
  nom: string;
  adresse: string;
  telephone: string;
  tenantId: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/pharmacies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deletePharmacy(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/pharmacies/${id}`, {
    method: 'DELETE',
  });
  return response;
}

// ======================== PHARMACIEN SERVICES ========================

export async function createPharmacien(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  matricule: string;
  specialite: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/pharmaciens`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function listPharmaciens() {
  const response = await apiFetch(`${API_ENDPOINT}/pharmaciens`);
  return response.json();
}

export async function getPharmacienById(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/pharmaciens/${id}`);
  return response.json();
}

export async function updatePharmacien(id: string, data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  matricule: string;
  specialite: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/pharmaciens/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deletePharmacien(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/pharmaciens/${id}`, {
    method: 'DELETE',
  });
  return response;
}

// ======================== FOURNISSEUR SERVICES ========================

export async function createFournisseur(data: {
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/fournisseurs`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function listFournisseurs(search: string = '', page: number = 0, size: number = 10) {
  const params = new URLSearchParams({
    search,
    page: page.toString(),
    size: size.toString(),
  });
  const response = await apiFetch(`${API_ENDPOINT}/fournisseurs?${params}`);
  return response.json();
}

export async function getFournisseurById(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/fournisseurs/${id}`);
  return response.json();
}

export async function updateFournisseur(id: string, data: {
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/fournisseurs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteFournisseur(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/fournisseurs/${id}`, {
    method: 'DELETE',
  });
  return response;
}

// ======================== MEDICAMENT SERVICES ========================

export async function createMedicament(data: {
  nom: string;
  imageUrl: string;
  description: string;
  prix: number;
  quantiteStock: number;
  seuilAlerte: number;
  dateExpiration: string;
  codeBarres: string;
  fournisseurId: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/medicaments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function listMedicaments(search: string = '', page: number = 0, size: number = 10) {
  const params = new URLSearchParams({
    search,
    page: page.toString(),
    size: size.toString(),
  });
  const response = await apiFetch(`${API_ENDPOINT}/medicaments?${params}`);
  return response.json();
}

export async function getMedicamentById(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/medicaments/${id}`);
  return response.json();
}

export async function updateMedicament(id: string, data: {
  nom: string;
  imageUrl: string;
  description: string;
  prix: number;
  quantiteStock: number;
  seuilAlerte: number;
  dateExpiration: string;
  codeBarres: string;
  fournisseurId: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/medicaments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteMedicament(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/medicaments/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function listLowStockMedicaments() {
  const response = await apiFetch(`${API_ENDPOINT}/medicaments/stock-faible`);
  return response.json();
}

export async function listExpiringMedicaments(daysFromNow: number = 30) {
  const params = new URLSearchParams({ daysFromNow: daysFromNow.toString() });
  const response = await apiFetch(`${API_ENDPOINT}/medicaments/expires?${params}`);
  return response.json();
}

// ======================== VENTE SERVICES ========================

export interface VenteLigne {
  medicamentId: string;
  quantite: number;
}

export async function createVente(lignes: VenteLigne[]) {
  const response = await apiFetch(`${API_ENDPOINT}/ventes`, {
    method: 'POST',
    body: JSON.stringify({ lignes }),
  });
  return response.json();
}

export async function listVentes(page: number = 0, size: number = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  const response = await apiFetch(`${API_ENDPOINT}/ventes?${params}`);
  return response.json();
}

export async function getVenteById(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/ventes/${id}`);
  return response.json();
}

export async function getVenteFacturePDF(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/ventes/${id}/facture`);
  return response.blob();
}

export async function updateVente(id: string, data: { statut: string }) {
  const response = await apiFetch(`${API_ENDPOINT}/ventes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteVente(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/ventes/${id}`, {
    method: 'DELETE',
  });
  return response;
}

// ======================== DASHBOARD SERVICES ========================

export async function getDashboard() {
  const response = await apiFetch(`${API_ENDPOINT}/dashboard`);
  return response.json();
}

export async function getPharmacienDashboard() {
  const response = await apiFetch(`${API_ENDPOINT}/pharmacien/dashboard`);
  return response.json();
}

export async function getAdminDashboard() {
  const response = await apiFetch(`${API_ENDPOINT}/admin/dashboard`);
  return response.json();
}

export async function getSuperAdminDashboard() {
  const response = await apiFetch(`${API_ENDPOINT}/superadmin/dashboard`);
  return response.json();
}

// ======================== PLAN SERVICES ========================

export async function createPlan(data: {
  nom: string;
  prixMensuel: number;
  maxUtilisateurs: number;
  features: string[];
}) {
  const response = await apiFetch(`${API_ENDPOINT}/plans`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function listPlans() {
  const response = await apiFetch(`${API_ENDPOINT}/plans`);
  return response.json();
}

export async function getPlanById(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/plans/${id}`);
  return response.json();
}

export async function updatePlan(id: string, data: {
  nom: string;
  prixMensuel: number;
  maxUtilisateurs: number;
  features: string[];
}) {
  const response = await apiFetch(`${API_ENDPOINT}/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deletePlan(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/plans/${id}`, {
    method: 'DELETE',
  });
  return response;
}

// ======================== ABONNEMENT SERVICES ========================

export async function createAbonnement(data: {
  dateDebut: string;
  dateFin: string;
  statut: string;
  planId: string;
  pharmacieId: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/abonnements`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function listAbonnements() {
  const response = await apiFetch(`${API_ENDPOINT}/abonnements`);
  return response.json();
}

export async function getAbonnementById(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/abonnements/${id}`);
  return response.json();
}

export async function updateAbonnement(id: string, data: {
  dateDebut: string;
  dateFin: string;
  statut: string;
  planId: string;
}) {
  const response = await apiFetch(`${API_ENDPOINT}/abonnements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteAbonnement(id: string) {
  const response = await apiFetch(`${API_ENDPOINT}/abonnements/${id}`, {
    method: 'DELETE',
  });
  return response;
}
// ======================== PAYMENT SERVICES ========================

export async function createFlouciPayment(planId: string) {
  const response = await apiFetch(`${API_ENDPOINT}/payments/flouci/plans/${planId}`, {
    method: 'POST',
  });
  return response.json();
}

export async function verifyFlouciPayment(paymentId: string) {
  const response = await apiFetch(`${API_ENDPOINT}/payments/flouci/verify/${paymentId}`);
  return response.json();
}
