

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getAllTickets, createTicket, getTicketTypes } from './ticketService';
import { useNavigate } from 'react-router-dom';

const Ticketlisting = () => {
  const userData = useSelector((store) => store.auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
    console.log("iser",userData)
  const navigate = useNavigate()
  // Form refs
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ticketTypeIdRef = useRef(null);
  const attachmentRef = useRef(null);

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();  
  }, [userData]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTickets(userData);
      setTickets(response?.data?.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Unable to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch ticket types when sidebar opens (or once on mount)
  const fetchTicketTypes = async () => {
    try {
      const response = await getTicketTypes();
      console.log("respnse tiekru totye",response)
      setTicketTypes(response?.data.data || []);
    } catch (err) {
      console.error('Failed to load ticket types:', err);
    }
  };

  const handleOpenSidebar = () => {
    setShowSidebar(true);
    if (ticketTypes.length === 0) fetchTicketTypes();
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);



    try {
      await createTicket({title:titleRef?.current.value,description:descriptionRef?.current.value,ticketTypeId:ticketTypeIdRef?.current.value,attachmentUrl: attachmentRef?.current.files[0]});
      handleCloseSidebar();
      fetchTickets(); // refresh list
      // Reset form (optional)
      titleRef.current.value = '';
      descriptionRef.current.value = '';
      if (attachmentRef.current) attachmentRef.current.value = '';
    } catch (err) {
      console.error('Ticket creation failed:', err);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Status badge styling
  const getStatusBadge = (statusName) => {
    const statusMap = {
      Open: 'bg-red-100 text-red-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      Resolved: 'bg-green-100 text-green-700',
      Closed: 'bg-gray-100 text-gray-700',
    };
    const classes = statusMap[statusName] || 'bg-gray-100 text-gray-700';
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>{statusName}</span>;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  // if (!tickets.length) return <EmptyState onOpen={handleOpenSidebar} />;

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">My Tickets</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage and track your support requests
            </p>
          </div>
          {userData?.user?.role==="CUSTOMER" ?<button
            onClick={handleOpenSidebar}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Create Ticket
          </button> :null}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Type
                </th>
                {userData?.user?.role =="AGENT" ?<th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>: null}
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 truncate text-sm font-medium text-blue-600">
                    {ticket.ref_no || `#${ticket.id}`}
                  </td>
                  <td className="px-4 py-3 truncate text-sm text-gray-900">
                    {ticket.title}
                  </td>
                  <td className="px-4 py-3 truncate text-sm text-gray-900">
                    {ticket.ticket_type}
                  </td>
                   {userData?.user?.role =="AGENT" ? <td className="px-4 py-3 truncate text-sm text-gray-900">
                    {ticket.created_by}
                  </td>: null}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(ticket.status_name)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() =>
                        (navigate(`/ticket/${ticket.id}`))
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide‑in Sidebar */}
      {showSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCloseSidebar}
          ></div>
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col rounded-l-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Create New Ticket
                </h3>
                <button
                  onClick={handleCloseSidebar}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details to raise a support request.
              </p>
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <form
                id="createTicketForm"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    ref={titleRef}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g., Payment issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    ref={descriptionRef}
                    rows="5"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe your issue in detail..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Type *
                  </label>
                  <select
                    ref={ticketTypeIdRef}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select a type</option>
                    {ticketTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment (optional)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                    <input
                      type="file"
                      ref={attachmentRef}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Max file size: 10MB (PDF, images)
                  </p>
                </div>
              </form>
            </div>

            {/* Fixed Footer with Buttons */}
            <div className="border-t border-gray-100 p-5 bg-gray-50">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseSidebar}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="createTicketForm"
                  disabled={submitting}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-xl py-2.5 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Helper components (can be defined inside or imported)
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
    <span className="ml-2 text-gray-600">Loading tickets...</span>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 text-center">{message}</div>
);

const EmptyState = ({ onOpen }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center text-gray-500">
    No tickets found.{" "}
    <button onClick={onOpen} className="text-blue-600 hover:underline">
      Create your first ticket!
    </button>
  </div>
);

export default Ticketlisting;

