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

  interface UploadResponse {
    message: string;
    thumbnail?: any; // Define your file type based on your requirements
  }
  

  // Mutation for creating a new event
  // const createEvent = useMutation({
  //   mutationFn: async (thumbnail: File): Promise<UploadResponse> => {
  //     const formData = new FormData();
  //     formData.append("thumbnail", thumbnail);
  //     formData.append("name", "name");
  //     formData.append("startDate", "2024-09-22T10:00:00");
  //     formData.append("endDate", "2024-09-23T17:00:00");
  //     formData.append("location", "San Francisco, CA");
  //     const token = localStorage.getItem("token"); // Adjust based on your token storage method
    
  //     console.log(formData);
  //     const response = await fetch("http://localhost:5001/api/events/", {
  //       // Updated URL
  //       method: "POST",
  //       body: formData,
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Include the token in the Authorization header
  //       },
  //     });
    
  //     if (!response.ok) {
  //       throw new Error("File upload failed");
  //     }
    
  //     return response.json();
  //   }, // Updated to use API instance
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['events'] });
  //   },
  // });

  const createEvent = useMutation({
    mutationFn: async (formData: {
      name: string;
      startDate: string; // Dates as strings to handle HTML input type="date"
      endDate: string;
      location: string;
      thumbnail: File | null;
      status: string;
    }): Promise<UploadResponse> => {
      const data = new FormData();
      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail); // Append the file if it exists
      }
      data.append("name", formData.name);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("location", formData.location);
      data.append("status", formData.status || "Ongoing"); 

      const response = await API.post(`/events`, data);
      return response.data;
    },
  });

  // const createEvent = useMutation({
  //   mutationFn: async (formData: { name: string;
  //     startDate: string; // Dates as strings to handle HTML input type="date"
  //     endDate: string;
  //     location: string;
  //     thumbnail: File|null;
  //   status:string}): Promise<UploadResponse> => {
  //     const data = new FormData();
  //     if (formData.thumbnail) {
  //       data.append("thumbnail", formData.thumbnail); // Append the file if it exists
  //     }      data.append("name", formData.name);
  //     data.append("startDate", formData.startDate);
  //     data.append("endDate", formData.endDate);
  //     data.append("location", formData.location);
      
  //     const token = localStorage.getItem("token"); // Adjust based on your token storage method
      
  //     const response = await fetch("http://localhost:5001/api/events/", {
  //       method: "POST",
  //       body: data,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     if (!response.ok) {
  //       throw new Error("Event creation failed");
  //     }
  
  //     return response.json();
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['events'] });
  //   },
  // });

  // const createEvent: UseMutationResult<UploadResponse, Error, File> = useMutation({
  //   mutationFn: uploadFile,
  //   onMutate: () => {
  //     setUploadProgress(0); // Reset progress
  //   },
  //   onSuccess: () => {
  //     alert("File uploaded successfully");
  //   },
  //   onError: (error: Error) => {
  //     alert(`Error: ${error.message}`);
  //   },
  //   onSettled: () => {
  //     setFile(null); // Reset file input
  //   },
  // });

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
