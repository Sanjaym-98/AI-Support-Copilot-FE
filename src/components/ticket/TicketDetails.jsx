
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import {
//   getTicketDetails,
//   updateTicketStatus,
//   getStatusWorkflow,
//   uploadDocumentToAI,
//   askKnowledgeBase,
//   sendMessage,
//   getMessages,
//   //   getMessages,
//   //   sendMessage,
// } from "./ticketService";
// import Header from "../header/Header";
// import { createSocketConnection } from "../../utils/socket";

// const TicketDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   console.log('usert',user)
//   const isAgent = user?.role === "AGENT";

//   // Ticket data
//   const [ticket, setTicket] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Status workflow
//   const [statuses, setStatuses] = useState([]);
//   const [allowedStatusIds, setAllowedStatusIds] = useState([]);
//   const [updatingStatus, setUpdatingStatus] = useState(false);

//   // AI Copilot
//   const [aiQuestion, setAiQuestion] = useState("");
//   const [aiAnswer, setAiAnswer] = useState("");
//   const [aiLoading, setAiLoading] = useState(false);
//   const [generatedReply, setGeneratedReply] = useState("");
//   const [conversationSummary, setConversationSummary] = useState("");
//   const [generatingReply, setGeneratingReply] = useState(false);
//   const [summarizing, setSummarizing] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   // Chat
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const socketRef = useRef()
//   // Safe date formatter
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const d = new Date(dateString);
//     return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleString();
//   };

 
//   // Fetch ticket details and messages
//   useEffect(() => {
//     fetchTicketDetails();
//     fetchMessages();
//     if (isAgent) fetchStatusWorkflow();
//   }, [id]);


//    useEffect(()=>{
//      if (!ticket) return;

//    const socket = createSocketConnection();
//    socketRef.current =socket;
//    console.log("ejejeje",ticket)
//    socket.emit('joinChat',{"ticketId":ticket.id,userName:user.name})
//     socket.on("messageRecived", ({ user_name,sender_role,user_id, text }) => {
//       console.log("messageRecived", user_name + "send message;-", text);
//       setMessages((prev) => [
//         ...prev,
//         { text, user_name,sender_role,user_id, created_at: new Date().toISOString() },
//       ]);
//     });
//    return ()=>{
//     socket.disconnect()
//    }
//   },[ticket,user])
//   const fetchTicketDetails = async () => {
//     setLoading(true);
//     const result = await getTicketDetails(id);
//     if (result.success) {
//       setTicket(result?.data?.data[0]);
//     } else {
//       setError(result.message);
//     }
//     setLoading(false);
//   };

//   const fetchMessages = async () => {
//     setLoadingMessages(true);
//     try {
//         const result = await getMessages(id);
//         console.log("getmessage API response",result)
//       if (result?.success) {
//         setMessages(result.data?.data || []);
//       }
//     } catch (err) {
//       console.error("Failed to load messages", err);
//     } finally {
//       setLoadingMessages(false);
//     }
//   };

//   const fetchStatusWorkflow = async () => {
//     const result = await getStatusWorkflow();
//     console.log("resilt", result);
//     if (result.success) setStatuses(result.data);
//   };

//   const handleStatusUpdate = async (newStatusId) => {
//     setUpdatingStatus(true);
//     const result = await updateTicketStatus(id, newStatusId);
//     if (result.success) {
//       await fetchTicketDetails();
//     } else {
//       alert(result.message);
//     }
//     setUpdatingStatus(false);
//   };

//   useEffect(() => {
//     if (ticket && statuses.length) {
//       const currentStatus = statuses.find((s) => s.id === ticket.status_id);
//       setAllowedStatusIds(currentStatus?.transition_allowed || []);
//     }
//   }, [ticket, statuses]);

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     setUploading(true);
//     const result = await uploadDocumentToAI(file);
//     if (result.success) {
//       alert("Document uploaded successfully!");
//     } else {
//       alert(result.message);
//     }
//     setUploading(false);
//     event.target.value = "";
//   };

//   const handleAskKnowledgeBase = async () => {
//     if (!aiQuestion.trim()) return;
//     setAiLoading(true);
//     const result = await askKnowledgeBase(aiQuestion);
//     if (result.success) {
//       setAiAnswer(result.data?.answer || "No answer found.");
//     } else {
//       setAiAnswer(result.message);
//     }
//     setAiLoading(false);
//     setAiQuestion("");
//   };

//   // Placeholder AI – replace with real endpoints later
//   const handleGenerateReply = () => {
//     setGeneratingReply(true);
//     setTimeout(() => {
//       setGeneratedReply(
//         "We are looking into your issue. Our team will update you shortly.",
//       );
//       setGeneratingReply(false);
//     }, 500);
//   };
//   const handleSummarize = () => {
//     setSummarizing(true);
//     setTimeout(() => {
//       setConversationSummary(
//         "Customer reported an issue. Agent acknowledged and is investigating.",
//       );
//       setSummarizing(false);
//     }, 500);
//   };

//   // Send message
//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {

//          socketRef.current?.emit('sendMessage',{ticketId:ticket.id,user_name:user.name,user_id:user.id,sender_role:user.role,text:newMessage});
       
//         await sendMessage(ticket.id,newMessage);
//       setNewMessage("");
//       // await fetchMessages(); // refresh
//     } catch (err) {
//       console.error("Failed to send message", err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
//         <span className="ml-2 text-gray-600">Loading ticket details...</span>
//       </div>
//     );
//   }

//   if (error || !ticket) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 text-center">
//         {error || "Ticket not found"}
//       </div>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
//         {/* Back button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="mb-4 flex items-center gap-1 text-blue-600 hover:text-blue-800"
//         >
//           ← Back
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left column – Ticket details + AI analysis + Chat */}
//           <div className={isAgent ? "lg:col-span-2" : "lg:col-span-3"}>
//             {/* Ticket Details Card */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
//                 <div>
//                   <h1 className="text-xl font-semibold text-gray-800">
//                     {ticket.ref_no || `#${ticket.id}`}
//                   </h1>
//                   <div className="flex gap-2 mt-1 flex-wrap">
//                     <span
//                       className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                         ticket.status_name === "Open"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-green-100 text-green-700"
//                       }`}
//                     >
//                       {ticket.status_name || "Unknown"}
//                     </span>
//                     {ticket.ai_priority && isAgent && (
//                       <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
//                         {ticket.ai_priority} priority
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   Created {formatDate(ticket.created_at)}
//                 </div>
//               </div>

//               <div className="p-6 space-y-5">
//                 <div>
//                   <h3 className="text-xs font-medium text-gray-500 uppercase">
//                     Customer
//                   </h3>
//                   <p className="mt-1 text-gray-900">
//                     {isAgent
//                       ? ticket.customer_name ||
//                         `Customer #${ticket.customer_id || "N/A"}`
//                       : "You"}
//                   </p>
//                 </div>
//                 {isAgent && ticket.assigned_agent_name && (
//                   <div>
//                     <h3 className="text-xs font-medium text-gray-500 uppercase">
//                       Assigned Agent
//                     </h3>
//                     <p className="mt-1 text-gray-900">
//                       {ticket.assigned_agent_name}
//                     </p>
//                   </div>
//                 )}
//                 <div>
//                   <h3 className="text-xs font-medium text-gray-500 uppercase">
//                     Title
//                   </h3>
//                   <p className="mt-1 text-gray-900">
//                     {ticket.title || "No title"}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="text-xs font-medium text-gray-500 uppercase">
//                     Description
//                   </h3>
//                   <p className="mt-1 text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
//                     {ticket.description || "No description provided"}
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <h3 className="text-xs font-medium text-gray-500 uppercase">
//                       Ticket Type
//                     </h3>
//                     <p className="mt-1 text-gray-900">
//                       {ticket.ticket_type || "General"}
//                     </p>
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-medium text-gray-500 uppercase">
//                       Last updated
//                     </h3>
//                     <p className="mt-1 text-gray-900">
//                       {formatDate(ticket.updated_at)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* AI analysis – agents only */}
//                 {isAgent && (
//                   <div className="border-t border-gray-200 pt-4 mt-2">
//                     <h3 className="text-sm font-semibold text-gray-700 mb-3">
//                       AI Analysis
//                     </h3>
//                     <div className="grid grid-cols-3 gap-4">
//                       {ticket.ai_category && (
//                         <div className="bg-blue-50 rounded-lg p-3 text-center">
//                           <p className="text-xs text-blue-600 uppercase">
//                             Category
//                           </p>
//                           <p className="text-sm font-medium text-blue-800 mt-1">
//                             {ticket.ai_category}
//                           </p>
//                         </div>
//                       )}
//                       {ticket.ai_sentiment && (
//                         <div className="bg-purple-50 rounded-lg p-3 text-center">
//                           <p className="text-xs text-purple-600 uppercase">
//                             Sentiment
//                           </p>
//                           <p className="text-sm font-medium text-purple-800 mt-1">
//                             {ticket.ai_sentiment}
//                           </p>
//                         </div>
//                       )}
//                       {ticket.ai_priority && (
//                         <div className="bg-orange-50 rounded-lg p-3 text-center">
//                           <p className="text-xs text-orange-600 uppercase">
//                             Priority
//                           </p>
//                           <p className="text-sm font-medium text-orange-800 mt-1">
//                             {ticket.ai_priority}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                     {ticket.ai_summary && (
//                       <div className="mt-3 bg-gray-50 rounded-lg p-3">
//                         <p className="text-xs text-gray-500 uppercase">
//                           AI Summary
//                         </p>
//                         <p className="text-sm text-gray-700 mt-1">
//                           {ticket.ai_summary}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Messages / Chat Section – visible to both roles */}
//             <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//                 <h3 className="font-medium text-gray-800">Conversation</h3>
//               </div>
//               <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
//                 {loadingMessages ? (
//                   <div className="text-center text-gray-400 text-sm">
//                     Loading messages...
//                   </div>
//                 ) : messages.length === 0 ? (
//                   <div className="text-center text-gray-400 text-sm">
//                     No messages yet. Start the conversation.
//                   </div>
//                 ) : (
//                   messages.map((msg, idx) => (
//                     <div
//                       key={idx}
//                       className={`flex ${msg?.sender_role === "AGENT" ? "justify-start" : "justify-end"}`}
//                     >
//                       <div
//                         className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
//                           msg.sender_role === "AGENT"
//                             ? "bg-gray-100 text-gray-800"
//                             : "bg-blue-600 text-white"
//                         }`}
//                       >
//                         <p className="font-medium text-xs mb-0.5">
//                           {msg?.user_id === user?.id
//                             ? "You"
//                             : msg?.sender_role === "AGENT"
//                               ? `${msg?.user_name} - Agent`
//                               : msg?.user_name || "Unknown"}
//                         </p>
//                         <p>{msg?.text}</p>
//                         <p
//                           className={`text-xs mt-1 ${msg.sender_role === "AGENT" ? "text-gray-400" : "text-black"}`}
//                         >
//                           {formatDate(msg.created_at)}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//               <div className="border-t border-gray-100 p-4 flex gap-2">
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                   placeholder="Type your message..."
//                   className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm transition"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right column – Actions & AI Copilot (agents only) */}
//           {isAgent && (
//             <div className="space-y-6">
//               {/* Status update */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
//                 <h3 className="font-semibold text-gray-800">Actions</h3>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Update status
//                   </label>
//                   <select
//                     value={ticket.status_id || ""}
//                     onChange={(e) => handleStatusUpdate(Number(e.target.value))}
//                     disabled={updatingStatus || allowedStatusIds.length === 0}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value={ticket.status_id}>
//                       {ticket.status_name}
//                     </option>
//                     {statuses
//                       .filter((s) => allowedStatusIds.includes(s.id))
//                       .map((status) => (
//                         <option key={status.id} value={status.id}>
//                           {status.name}
//                         </option>
//                       ))}
//                     {allowedStatusIds.length === 0 && (
//                       <option disabled>No allowed transitions</option>
//                     )}
//                   </select>
//                   {updatingStatus && (
//                     <p className="text-xs text-gray-400 mt-1">Updating...</p>
//                   )}
//                 </div>

//                 {/* Upload document */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Upload document to AI
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,.doc,.docx,.txt"
//                     onChange={handleFileUpload}
//                     disabled={uploading}
//                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                   />
//                   {uploading && (
//                     <p className="text-xs text-gray-400 mt-1">Uploading...</p>
//                   )}
//                   <p className="text-xs text-gray-400 mt-1">
//                     Supported: PDF, DOC, TXT (max 10MB)
//                   </p>
//                 </div>
//               </div>

//               {/* AI Copilot */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
//                 <h3 className="font-semibold text-gray-800 flex items-center gap-2">
//                   ✨ AI Copilot
//                 </h3>

//                 <button
//                   onClick={handleSummarize}
//                   disabled={summarizing}
//                   className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg py-2 text-sm font-medium transition disabled:opacity-50"
//                 >
//                   {summarizing ? "Summarizing..." : "Summarize conversation"}
//                 </button>
//                 {conversationSummary && (
//                   <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
//                     {conversationSummary}
//                   </div>
//                 )}
//                 <hr />
//                 <div>
//                   <textarea
//                     value={aiQuestion}
//                     onChange={(e) => setAiQuestion(e.target.value)}
//                     placeholder="Ask knowledge base..."
//                     rows="2"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     onClick={handleAskKnowledgeBase}
//                     disabled={aiLoading || !aiQuestion.trim()}
//                     className="w-full mt-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg py-2 text-sm transition disabled:opacity-50"
//                   >
//                     {aiLoading ? "Searching..." : "Search knowledge"}
//                   </button>
//                 </div>
//                 {aiAnswer && (
//                   <div>
//                     <div className="mt-2 p-3 bg-green-50 rounded-lg text-sm text-gray-700">
//                       <p className="font-medium text-xs text-green-700 mb-1">
//                         Answer
//                       </p>
//                       {aiAnswer}
//                     </div>
//                     <button
//                       className="mt-2 text-xs text-red-600 hover:underline"
//                       onClick={() => setAiAnswer("")}
//                     >
//                       Clear
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default TicketDetails;



import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getTicketDetails,
  updateTicketStatus,
  getStatusWorkflow,
  uploadDocumentToAI,
  askKnowledgeBase,
  sendMessage,
  getMessages,
  processRefund,
  getSummary,
  fetchUploadedDocs
} from "./ticketService";
import Header from "../header/Header";
import { createSocketConnection } from "../../utils/socket";
import toast from 'react-hot-toast';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log('usert',user)
  const isAgent = user?.role === "AGENT";

  // Ticket data
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status workflow
  const [statuses, setStatuses] = useState([]);
  const [allowedStatusIds, setAllowedStatusIds] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // AI Copilot
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState("");
  const [conversationSummary, setConversationSummary] = useState("");
  const [generatingReply, setGeneratingReply] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  // Refund
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [processingRefund, setProcessingRefund] = useState(false);
  const REFUND_AMOUNT = 499;

  // Chat
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const socketRef = useRef();
  const chatContainerRef = useRef(null);
  // Safe date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleString();
  };

 
  // Fetch ticket details and messages
  useEffect(() => {
    fetchTicketDetails();
    fetchMessages();
    fetchDocs();

    if (isAgent) fetchStatusWorkflow();
  }, [id]);


   useEffect(()=>{
     if (!ticket) return;

   const socket = createSocketConnection();
   socketRef.current =socket;
   console.log("ejejeje",ticket)
   socket.emit('joinChat',{"ticketId":ticket.id,userName:user.name})
    socket.on("messageRecived", ({ user_name,sender_role,user_id, text }) => {
      console.log("messageRecived", user_name + "send message;-", text);
      setMessages((prev) => [
        ...prev,
        { text, user_name,sender_role,user_id, created_at: new Date().toISOString() },
      ]);
    });
   return ()=>{
    socket.disconnect()
   }
  },[ticket,user])
  const fetchTicketDetails = async () => {
    setLoading(true);
    const result = await getTicketDetails(id);
    if (result.success) {
      setTicket(result?.data?.data[0]);
      console.log("ticket.refund_status",ticket)
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
        const result = await getMessages(id);
        console.log("getmessage API response",result)
      if (result?.success) {
        setMessages(result.data?.data || []);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchStatusWorkflow = async () => {
    const result = await getStatusWorkflow();
    console.log("resilt", result);
    if (result.success) setStatuses(result.data);
  };

  const handleStatusUpdate = async (newStatusId) => {
    setUpdatingStatus(true);
    const result = await updateTicketStatus(id, newStatusId);
    if (result.success) {
      toast.success("Ticket status updated successfully!")
      await fetchTicketDetails();
    } else {
      alert(result.message);
    }
    setUpdatingStatus(false);
  };

  useEffect(() => {
    if (ticket && statuses.length) {
      const currentStatus = statuses.find((s) => s.id === ticket.status_id);
      setAllowedStatusIds(currentStatus?.transition_allowed || []);
    }
  }, [ticket, statuses]);

    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, [messages]);     

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    const result = await uploadDocumentToAI(file);
    if (result.success) {
      alert("Document uploaded successfully!");
    } else {
      alert(result.message);
    }
    setUploading(false);
    event.target.value = "";
  };

  const handleAskKnowledgeBase = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    const result = await askKnowledgeBase(aiQuestion);
    if (result.success) {
      setAiAnswer(result.data?.answer || "No answer found.");
    } else {
      setAiAnswer(result.message);
    }
    setAiLoading(false);
    setAiQuestion("");
  };

  const handleProcessRefund = async () => {
    if (!refundReason.trim()) {
      toast.error("Please enter a reason for the refund");
      return;
    }

    setProcessingRefund(true);
    try {
      const result = await processRefund(ticket.id, refundReason);
      if (result.success) {
        toast.success(`✅ Refund of ₹${REFUND_AMOUNT} processed successfully!`);
        setShowRefundModal(false);
        setRefundReason("");
        await fetchTicketDetails();
      } else {
        toast.error(result.message || "Failed to process refund");
      }
    } catch (error) {
      console.error("Refund error:", error);
      toast.error("Failed to process refund. Please try again.");
    } finally {
      setProcessingRefund(false);
    }
  };

  // Placeholder AI – replace with real endpoints later
  const handleGenerateReply = () => {
    setGeneratingReply(true);
    setTimeout(() => {
      setGeneratedReply(
        "We are looking into your issue. Our team will update you shortly.",
      );
      setGeneratingReply(false);
    }, 500);
  };
  const handleSummarize = async() => {
    setSummarizing(true);
    let getConversationSummary = await getSummary(ticket.id);

    if(getConversationSummary.success){
      console.log("getConversationSummary",getConversationSummary)
      setConversationSummary(getConversationSummary.result?.summary)
      setSummarizing(false)
    }else{
      setConversationSummary(getConversationSummary.result?.summary)
      setSummarizing(false)
    }
    
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {

         socketRef.current?.emit('sendMessage',{ticketId:ticket.id,user_name:user.name,user_id:user.id,sender_role:user.role,text:newMessage});
       
        await sendMessage(ticket.id,newMessage);
      setNewMessage("");
      // await fetchMessages(); // refresh
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const fetchDocs = async () => {
    setLoadingDocs(true);
    let result = await fetchUploadedDocs();
    console.log("fresu",result)
    if (result?.success) {

      setUploadedDocs(result.data || []);
    }else{
      setUploadedDocs(result.message)
    }
    setLoadingDocs(false)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        <span className="ml-2 text-gray-600">Loading ticket details...</span>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 text-center">
        {error || "Ticket not found"}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column – Ticket details + AI analysis + Chat */}
          <div className={isAgent ? "lg:col-span-2" : "lg:col-span-3"}>
            {/* Ticket Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    {ticket.ref_no || `#${ticket.id}`}
                  </h1>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        ticket.status_name === "Open"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.status_name || "Unknown"}
                    </span>
                    {ticket.ai_priority && isAgent && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        {ticket.ai_priority} priority
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Created {formatDate(ticket.created_at)}
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </h3>
                  <p className="mt-1 text-gray-900">
                    {isAgent
                      ? ticket.customer_name ||
                        `Customer #${ticket.customer_id || "N/A"}`
                      : "You"}
                  </p>
                </div>
                {isAgent && ticket.assigned_agent_name && (
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase">
                      Assigned Agent
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {ticket.assigned_agent_name}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase">
                    Title
                  </h3>
                  <p className="mt-1 text-gray-900">
                    {ticket.title || "No title"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase">
                    Description
                  </h3>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {ticket.description || "No description provided"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase">
                      Ticket Type
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {ticket.ticket_type || "General"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase">
                      Last updated
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {formatDate(ticket.updated_at)}
                    </p>
                  </div>
                </div>

                {/* AI analysis – agents only */}
                {isAgent && (
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      AI Analysis
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {ticket.ai_category && (
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-blue-600 uppercase">
                            Category
                          </p>
                          <p className="text-sm font-medium text-blue-800 mt-1">
                            {ticket.ai_category}
                          </p>
                        </div>
                      )}
                      {ticket.ai_sentiment && (
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-purple-600 uppercase">
                            Sentiment
                          </p>
                          <p className="text-sm font-medium text-purple-800 mt-1">
                            {ticket.ai_sentiment}
                          </p>
                        </div>
                      )}
                      {ticket.ai_priority && (
                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-orange-600 uppercase">
                            Priority
                          </p>
                          <p className="text-sm font-medium text-orange-800 mt-1">
                            {ticket.ai_priority}
                          </p>
                        </div>
                      )}
                    </div>
                    {ticket.ai_summary && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase">
                          AI Summary
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {ticket.ai_summary}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Messages / Chat Section – visible to both roles */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Chats</h3>
              </div>
              <div
                ref={chatContainerRef}
                className="p-4 space-y-4 max-h-96 overflow-y-auto"
              >
                {loadingMessages ? (
                  <div className="text-center text-gray-400 text-sm">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm">
                    No messages yet. Start the conversation.
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg?.sender_role === "AGENT" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                          msg.sender_role === "AGENT"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        <p className="font-thin text-xs mb-0.5">
                          {msg?.user_id === user?.id
                            ? "You"
                            : msg?.sender_role === "AGENT"
                              ? `${msg?.user_name} - Agent`
                              : msg?.user_name || "Unknown"}
                        </p>

                        <p className="text-lg">{msg?.text}</p>
                        <p
                          className={`text-xs mt-1 ${msg.sender_role === "AGENT" ? "text-gray-400" : "text-black"}`}
                        >
                          {formatDate(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-gray-100 p-4 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right column – Actions & AI Copilot (agents only) */}
          {isAgent && (
            <div className="space-y-6">
              {/* Status update */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
                <h3 className="font-semibold text-gray-800">Actions</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Update status
                  </label>
                  <select
                    value={ticket.status_id || ""}
                    onChange={(e) => handleStatusUpdate(Number(e.target.value))}
                    disabled={updatingStatus || allowedStatusIds.length === 0}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={ticket.status_id}>
                      {ticket.status_name}
                    </option>
                    {statuses
                      .filter((s) => allowedStatusIds.includes(s.id))
                      .map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    {allowedStatusIds.length === 0 && (
                      <option disabled>No allowed transitions</option>
                    )}
                  </select>
                  {updatingStatus && (
                    <p className="text-xs text-gray-400 mt-1">Updating...</p>
                  )}
                </div>

                {/* Upload document */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Upload document to AI
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploading && (
                    <p className="text-xs text-gray-400 mt-1">Uploading...</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Supported: PDF, DOC, TXT (max 10MB)
                  </p>
                </div>

                {/* Refund Management */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Refund Management
                  </h4>

                  {/* Show refund details if already processed */}
                  {ticket.refund_status && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium ${
                            ticket.refund_status === "processed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {ticket.refund_status === "processed"
                            ? "✅ Processed"
                            : "Pending"}
                        </span>
                      </div>
                      {ticket.refund_id && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-600">Refund ID:</span>
                          <span className="text-gray-800 text-xs font-mono">
                            {ticket.refund_id}
                          </span>
                        </div>
                      )}
                      {ticket.refund_amount && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-600">Amount:</span>
                          <span className="text-gray-800 font-medium">
                            ₹{ticket.refund_amount}
                          </span>
                        </div>
                      )}
                      {ticket.refunded_at && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-600">Processed on:</span>
                          <span className="text-gray-600 text-sm">
                            {formatDate(ticket.refunded_at)}
                          </span>
                        </div>
                      )}
                      {ticket.refund_reason && (
                        <div className="mt-1">
                          <span className="text-gray-600">Reason:</span>
                          <p className="text-gray-700 text-sm mt-0.5">
                            {ticket.refund_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Process Refund Button – enabled ONLY when status_id === 6 */}
                  {ticket.refund_status !== "processed" && (
                    <button
                      onClick={() => setShowRefundModal(true)}
                      disabled={
                        ticket.status_id !== 6 ||
                        ticket.refund_status === "processed"
                      }
                      className={`w-full text-white rounded-lg py-2 text-sm font-medium transition ${
                        ticket.status_id === 6 &&
                        ticket.refund_status !== "processed"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400 cursor-not-allowed opacity-60"
                      }`}
                    >
                      {ticket.status_id === 6 &&
                      ticket.refund_status !== "processed"
                        ? `Process Refund (₹${REFUND_AMOUNT})`
                        : ticket.refund_status === "processed"
                          ? "✅ Refund Completed"
                          : "⛔ Refund Not Available"}
                    </button>
                  )}
                </div>
              </div>

              {/* AI Copilot */}
              {/* AI Copilot */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  ✨ AI Copilot
                </h3>

                <button
                  onClick={handleSummarize}
                  disabled={summarizing}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg py-2 text-sm font-medium transition disabled:opacity-50"
                >
                  {summarizing ? "Summarizing..." : "Summarize conversation"}
                </button>
                {conversationSummary && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    {conversationSummary}
                  </div>
                )}
                <hr />

                <div className="flex gap-2">
                  <textarea
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask knowledge base..."
                    rows="2"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  {/* <button
                    onClick={() => setShowDocs(!showDocs)}
                    className={`px-3 py-2 rounded-lg text-sm transition whitespace-nowrap ${
                      showDocs
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Toggle uploaded documents"
                    
                  >
                    
                  </button> */}

                  <button
                    onClick={() => setShowDocs(!showDocs)}
                    className={`px-3 py-2 rounded-lg text-sm transition whitespace-nowrap ${
                      showDocs
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="View documents"
                  >
                    <svg
                      className="w-5 h-5 inline-block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleAskKnowledgeBase}
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="w-full mt-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg py-2 text-sm transition disabled:opacity-50"
                >
                  {aiLoading ? "Searching..." : "Search knowledge"}
                </button>
                {aiAnswer && (
                  <div>
                    <div className="mt-2 p-3 bg-green-50 rounded-lg text-sm text-gray-700">
                      <p className="font-medium text-xs text-green-700 mb-1">
                        Answer
                      </p>
                      {aiAnswer}
                    </div>
                    <button
                      className="mt-2 text-xs text-red-600 hover:underline"
                      onClick={() => setAiAnswer("")}
                    >
                      Clear
                    </button>
                  </div>
                )}

                {showDocs && (
                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Uploaded Documents
                      </h4>
                      <button
                        onClick={fetchDocs}
                        disabled={loadingDocs}
                        className="text-xs text-blue-600 hover:text-blue-800 transition"
                      >
                        {loadingDocs ? "Loading..." : "↻ Refresh"}
                      </button>
                    </div>

                    {loadingDocs ? (
                      <div className="text-center text-gray-400 text-sm py-2">
                        Loading documents...
                      </div>
                    ) : uploadedDocs.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm py-2">
                        No documents uploaded yet.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {uploadedDocs.map((doc) => (
                          <div
                            key={doc.id || doc.file_name}
                            className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <svg
                                className="w-4 h-4 text-blue-600 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm text-gray-800 truncate">
                                {doc.file_name}
                              </span>
                            </div>
                           
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Process Refund
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Refund amount:{" "}
              <span className="font-medium text-gray-800">
                ₹{REFUND_AMOUNT}
              </span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for refund
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Why is this refund being processed?"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                disabled={processingRefund}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleProcessRefund}
                disabled={processingRefund || !refundReason.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingRefund ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 inline mr-2"
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
                    Processing...
                  </>
                ) : (
                  "Process Refund"
                )}
              </button>
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundReason("");
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
                disabled={processingRefund}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketDetails;