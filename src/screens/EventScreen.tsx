import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Header, EventsList, Event, EventModal } from '../components';
import { colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getEventsForDate, updateEvent } from '../utils/eventsService';
import { eventSchema, getValidationErrors } from '../utils/validation';
import {
  formatDate,
  getDefaultEventData,
  prepareEventData,
} from '../utils/helpers';
import * as yup from 'yup';

export default function EventScreen() {
  const { user, selectedDate } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventData, setEventData] = useState(getDefaultEventData());
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const loadEventsForDate = useCallback(
    async (date: Date) => {
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
    },
    [user?.uid],
  );

  useEffect(() => {
    if (user?.uid) {
      loadEventsForDate(selectedDate);
    }
  }, [user?.uid, loadEventsForDate, selectedDate]);

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventData({
      title: event.title,
      time: event.time,
      description: event.description || '',
      color: event.color || getDefaultEventData().color,
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
      const updatedEvent = {
        ...prepareEventData(eventData),
        id: editingEvent.id,
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
    setEventData(getDefaultEventData());
    setEditingEvent(null);
    setValidationErrors({});
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetModal();
  };

  return (
    <>
      <Header title="Events" subtitle={formatDate(selectedDate)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoadingEvents ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <EventsList
            events={events}
            selectedDate={selectedDate}
            onEditEvent={handleEditEvent}
          />
        )}
      </ScrollView>

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
    </>
  );
}
