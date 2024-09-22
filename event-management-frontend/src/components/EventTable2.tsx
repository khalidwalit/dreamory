import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  MenuItem,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { SelectChangeEvent } from "@mui/material";

interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "Ongoing" | "Completed";
  location: string;
  thumbnail: string;
}

interface EventTableProps {
  events: Event[];
  onUpdate: (event: Event) => void;
}

const EventTable2: React.FC<EventTableProps> = ({ events, onUpdate }) => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [thumbnail, setThumbnail] = useState<string>("");

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setThumbnail(event.thumbnail);
  };

  const handleSave = () => {
    if (editingEvent) {
      onUpdate({ ...editingEvent, thumbnail });
      setEditingEvent(null);
      setThumbnail("");
    }
  };

  const handleChangeStatus = (
    event: SelectChangeEvent<"Ongoing" | "Completed">,
    id: number
  ) => {
    if (editingEvent) {
      onUpdate({
        ...editingEvent,
        status: event.target.value as "Ongoing" | "Completed",
      });
    }
  };
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.startDate}</TableCell>
              <TableCell>{event.endDate}</TableCell>
              <TableCell>
                <Select
                  value={
                    editingEvent?.id === event.id
                      ? editingEvent.status
                      : event.status
                  }
                  onChange={(e) => handleChangeStatus(e, event.id)}
                  disabled={editingEvent?.id !== event.id}
                >
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(event)}>
                  <EditIcon />
                </IconButton>
                {/* {editingEvent?.id === event.id && (
                  <>
                    <TextField
                      type="file"
                      onChange={(e) => setThumbnail(e.target.files[0]?.name || '')}
                    />
                    <Button onClick={handleSave}>Save</Button>
                  </>
                )} */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventTable2;
