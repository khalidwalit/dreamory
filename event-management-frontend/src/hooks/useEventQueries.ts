import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { Event } from '../types/Event';

const fetchEvents = async (page: number, limit: number): Promise<Event[]> => {
  const response = await API.get('/events', {
    params: { page, limit },
  });
  return response.data.events;
};

const fetchEventById = async (eventId: string): Promise<Event> => {
  const response = await API.get(`/events/${eventId}`);
  return response.data;
};

const useEventQueries = () => {
  const queryClient = useQueryClient();

  const useFetchEvents = (page: number, limit: number) => {
    return useQuery<Event[], Error>({
      queryKey: ['events', page, limit],
      queryFn: () => fetchEvents(page, limit),
    });
  };

  const useGetEvent = (eventId: string) => {
    return useQuery<Event, Error>({
      queryKey: ['event', eventId],
      queryFn: () => fetchEventById(eventId),
      enabled: !!eventId,
    });
  };

  interface UploadResponse {
    message: string;
    thumbnail?: any;
  }

  const createEvent = useMutation({
    mutationFn: async (formData: {
      name: string;
      startDate: string;
      endDate: string;
      location: string;
      thumbnail: File | null;
      status: string;
    }): Promise<UploadResponse> => {
      const data = new FormData();
      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail);
      }
      data.append("name", formData.name);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("location", formData.location);
      data.append("status", formData.status || "Ongoing");

      const response = await API.post(`/events`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateEvent = useMutation({
    mutationFn: async (formData: {
      id: string;
      name: string;
      startDate: string;
      endDate: string;
      location: string;
      thumbnail: File | null;
      status: string;
    }): Promise<UploadResponse> => {
      const data = new FormData();
      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail);
      }
      data.append("name", formData.name);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("location", formData.location);
      data.append("status", formData.status || "Ongoing");

      const response = await API.put(`/events/${formData.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async (formData: {
      id: string;
      status: string;
    }): Promise<UploadResponse> => {
      const data = new FormData();
      data.append("status", formData.status || "Ongoing");

      const response = await API.put(`/events/${formData.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (formData: {
      id: string;
      password: string;
    }): Promise<UploadResponse> => {
      const data = new FormData();
      data.append("password", formData.password);

      const response = await API.delete(`/events/${formData.id}`, { data: formData });
      return response.data;
    },
    onError: (error: Error) => {
      alert(`Error: Password Incorrect`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    useFetchEvents,
    useGetEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    updateStatus,
  };
};

export default useEventQueries;
