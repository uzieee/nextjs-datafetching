interface PetfinderTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PetfinderPhoto {
  small: string;
  medium: string;
  large: string;
  full: string;
}

interface PetfinderAnimal {
  id: number;
  organization_id: string;
  url: string;
  type: string;
  species: string;
  breeds: {
    primary: string;
    secondary: string | null;
    mixed: boolean;
    unknown: boolean;
  };
  colors: {
    primary: string | null;
    secondary: string | null;
    tertiary: string | null;
  };
  age: string;
  gender: string;
  size: string;
  coat: string | null;
  attributes: {
    spayed_neutered: boolean;
    house_trained: boolean;
    declawed: boolean | null;
    special_needs: boolean;
    shots_current: boolean;
  };
  environment: {
    children: boolean | null;
    dogs: boolean | null;
    cats: boolean | null;
  };
  tags: string[];
  name: string;
  description: string | null;
  organization_animal_id: string;
  photos: PetfinderPhoto[];
  primary_photo_cropped: PetfinderPhoto | null;
  status: string;
  status_changed_at: string;
  published_at: string;
  distance: number | null;
  contact: {
    email: string;
    phone: string;
    address: {
      address1: string | null;
      address2: string | null;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  };
  _links: {
    self: {
      href: string;
    };
    type: {
      href: string;
    };
    organization: {
      href: string;
    };
  };
}

interface PetfinderResponse {
  animals: PetfinderAnimal[];
  pagination: {
    count_per_page: number;
    total_count: number;
    current_page: number;
    total_pages: number;
    _links: {
      next?: {
        href: string;
      };
      previous?: {
        href: string;
      };
    };
  };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const apiKey = process.env.PETFINDER_API_KEY;
  const apiSecret = process.env.PETFINDER_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('PETFINDER_API_KEY and PETFINDER_API_SECRET must be set');
  }

  const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: apiSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const data: PetfinderTokenResponse = await response.json();
  
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

export async function fetchAnimals(params?: {
  type?: string;
  location?: string;
  distance?: number;
  limit?: number;
  page?: number;
}): Promise<PetfinderResponse> {
  const token = await getAccessToken();

  const searchParams = new URLSearchParams();
  if (params?.type) {
    searchParams.append('type', params.type);
  }
  if (params?.location) {
    searchParams.append('location', params.location);
  }
  if (params?.distance) {
    searchParams.append('distance', params.distance.toString());
  }
  if (params?.limit) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params?.page) {
    searchParams.append('page', params.page.toString());
  }

  const url = `https://api.petfinder.com/v2/animals?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch animals: ${errorText}`);
  }

  return response.json();
}

export async function fetchAnimalById(id: string): Promise<PetfinderAnimal> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch animal: ${errorText}`);
  }

  const data: { animal: PetfinderAnimal } = await response.json();
  return data.animal;
}

export type { PetfinderAnimal, PetfinderPhoto, PetfinderResponse };

