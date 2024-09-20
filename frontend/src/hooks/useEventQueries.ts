import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api'; // Adjust the import based on your project structure
import { Event } from '../types/Event';

// API calls
const fetchEvents = async (): Promise<Event[]> => {
  const response = await API.get('/events'); // Updated to use API instance
  return response.data;
};

const fetchEventById = async (eventId: string): Promise<Event> => {
  const response = await API.get(`/events/${eventId}`); // Updated to use API instance
  return response.data;
};

// Hook
const useEventQueries = () => {
  const queryClient = useQueryClient();

  // Fetch all events
  const { data: events = [], error: eventsError = null, isLoading: eventsLoading } = useQuery<Event[], Error>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const useGetEvent = (eventId: string) => {
    return useQuery<Event, Error>({
      queryKey: ['event', eventId],
      queryFn: () => fetchEventById(eventId),
      enabled: !!eventId, // Only run the query if the eventId exists
    });
  };

  // Mutation for creating a new event
  const createEvent = useMutation<Event, Error, Partial<Event>>({
    mutationFn: (newEvent) => API.post('/events', newEvent), // Updated to use API instance
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // Mutation for updating an event
  const updateEvent = useMutation<Event, Error, { id: string; data: Partial<Event> }>({
    mutationFn: ({ id, data }) => API.put(`/events/${id}`, data), // Updated to use API instance
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // Mutation for deleting an event
  const deleteEvent = useMutation<void, Error, string>({
    mutationFn: (eventId) => API.delete(`/events/${eventId}`), // Updated to use API instance
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    events,
    eventsError,
    eventsLoading,
    useGetEvent,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};

export default useEventQueries;
