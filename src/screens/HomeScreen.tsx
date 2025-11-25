import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Header, Calendar, EventsList, Event, EventModal } from '../components';
import { colors } from '../constants/theme';
import { styles } from '../styles/HomeScreenStyles';
import { useAuth } from '../context/AuthContext';
import {
  getEventsForDate,
  saveEvent,
  updateEvent,
} from '../utils/eventsService';
import { eventSchema, getValidationErrors } from '../utils/validation';
import * as yup from 'yup';

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventData, setEventData] = useState({
    title: '',
    time: '',
    description: '',
    color: colors.primary,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (user?.uid) {
      loadEventsForDate(selectedDate);
    }
  }, [user]);

  const loadEventsForDate = async (date: Date) => {
    if (!user?.uid) return;

    setIsLoadingEvents(true);
    try {
      const dateEvents = await getEventsForDate(user.uid, date);
      setEvents(dateEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    await loadEventsForDate(date);
  };

  const handleAddEvent = async () => {
    if (!user?.uid) {
      return;
    }

    try {
      await eventSchema.validate(eventData, { abortEarly: false });
      setValidationErrors({});
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = getValidationErrors(error);
        setValidationErrors(errors);
        return;
      }
    }

    try {
      const event: Event = {
        id: '',
        title: eventData.title.trim(),
        time: eventData.time.trim(),
        description: eventData.description.trim() || undefined,
        color: eventData.color,
      };

      await saveEvent(user.uid, selectedDate, event);
      resetModal();
      setShowAddModal(false);
      await loadEventsForDate(selectedDate);
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to add event. Please try again.');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventData({
      title: event.title,
      time: event.time,
      description: event.description || '',
      color: event.color || colors.primary,
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async () => {
    if (!user?.uid || !editingEvent) {
      Alert.alert('Error', 'You must be logged in to edit events');
      return;
    }

    try {
      await eventSchema.validate(eventData, { abortEarly: false });
      setValidationErrors({});
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = getValidationErrors(error);
        setValidationErrors(errors);
        return;
      }
    }

    try {
      const updatedEvent: Event = {
        id: editingEvent.id,
        title: eventData.title.trim(),
        time: eventData.time.trim(),
        description: eventData.description.trim() || undefined,
        color: eventData.color,
      };

      await updateEvent(user.uid, selectedDate, editingEvent.id, updatedEvent);
      resetModal();
      setEditingEvent(null);
      setShowEditModal(false);
      await loadEventsForDate(selectedDate);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event. Please try again.');
    }
  };

  const resetModal = () => {
    setEventData({
      title: '',
      time: '',
      description: '',
      color: colors.primary,
    });
    setEditingEvent(null);
    setValidationErrors({});
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetModal();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetModal();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Calendar"
        subtitle={selectedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      />
      <ScrollView>
        <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
        {isLoadingEvents ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loaderText}>Loading events...</Text>
          </View>
        ) : (
          <EventsList
            events={events}
            selectedDate={selectedDate}
            onEditEvent={handleEditEvent}
          />
        )}
      </ScrollView>

      <EventModal
        visible={showAddModal}
        mode="add"
        selectedDate={selectedDate}
        eventData={eventData}
        onClose={handleCloseAddModal}
        onSave={handleAddEvent}
        onEventDataChange={setEventData}
        validationErrors={validationErrors}
      />

      <EventModal
        visible={showEditModal}
        mode="edit"
        selectedDate={selectedDate}
        eventData={eventData}
        onClose={handleCloseEditModal}
        onSave={handleUpdateEvent}
        onEventDataChange={setEventData}
        validationErrors={validationErrors}
      />
    </View>
  );
}
