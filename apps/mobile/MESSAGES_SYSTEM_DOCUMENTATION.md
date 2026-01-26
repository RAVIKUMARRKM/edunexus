# Messages/Communication System - Mobile App

## Overview
A complete messaging system for the EduNexus mobile app that allows users to send and receive private messages within the school management platform.

## Created Files

### App Screens
1. **`app/messages/index.tsx`** - Messages Inbox Screen
2. **`app/messages/[id].tsx`** - Message Detail Screen
3. **`app/messages/compose.tsx`** - Compose Message Screen

### Components
4. **`components/messages/MessageCard.tsx`** - Message Card Component
5. **`components/messages/RecipientSelector.tsx`** - Recipient Selector Component

### API Routes (Web)
6. **`apps/web/app/api/messages/[id]/route.ts`** - Get/Delete Message API
7. **`apps/web/app/api/messages/[id]/read/route.ts`** - Mark Message as Read API

## Features

### Messages Inbox Screen (`/messages`)
- **Blue header** with "Messages" title
- **Tab selector** with two tabs:
  - "Received" - Shows incoming messages
  - "Sent" - Shows outgoing messages
- **Unread count badge** on "Received" tab when there are unread messages
- **Pull-to-refresh** functionality
- **Message cards** displaying:
  - Sender/receiver avatar (circle with initial)
  - Sender/receiver name
  - Role badge
  - Subject line (if present, bold if unread)
  - Content preview (first 80 characters)
  - Timestamp (smart formatting: "Just now", "5m ago", "2h ago", "Yesterday", "3d ago", or date)
  - Unread indicator (blue dot for unread received messages)
  - Message type indicator (Received/Sent)
- **Empty state** for each tab with helpful messages
- **Floating action button** to compose new message
- Auto-refresh on tab switch
- Visual highlighting for unread messages (blue border and background)

### Message Detail Screen (`/messages/[id]`)
- **Header** with sender/receiver info and back button
- **User card** showing:
  - Avatar with initial
  - Full name
  - Email address
  - Role badge
  - "New" badge if unread
- **Timestamp** with full date and time
- **Subject section** (if subject exists)
- **Message content** in dedicated section
- **Action buttons**:
  - **Reply button** - Navigates to compose with pre-filled recipient
  - **Delete button** - Only for received messages, with confirmation dialog
- **Auto mark as read** when opened (for received messages only)
- Scrollable content for long messages
- Proper permission checking (only sender/receiver can view)

### Compose Message Screen (`/messages/compose`)
- **Blue header** with "Compose Message" title and close button
- **Two-step process**:
  1. Recipient selection screen
  2. Message composition screen
- **Recipient Selector**:
  - Search users by name, email, or role
  - Filter by role chips (All, Teachers, Parents, Students, Staff, Admins)
  - User list with avatars, names, emails, and role badges
  - Shows user count
  - Empty state when no users found
- **Selected recipient display**:
  - Blue card with user info
  - "Change" button to reselect
- **Subject input** (optional)
- **Message content textarea**:
  - Required field
  - Minimum 10 characters
  - Real-time character count
  - Multi-line input with minimum height
  - Validation feedback
- **Send button**:
  - Disabled when invalid (no recipient or content too short)
  - Loading state while sending
  - Success message and navigation on completion
- **URL parameter support** (`?userId=xxx`) for direct messaging
- **Keyboard-aware** layout (avoids keyboard overlap)
- **Help text** explaining the message flow

### MessageCard Component
- Reusable card for displaying messages in list
- **Props**:
  - `message` - Message object
  - `type` - 'received' or 'sent'
  - `onPress` - Callback for card tap
- **Features**:
  - Smart date formatting
  - Text truncation for subject and content
  - Unread visual indicators
  - Role badges
  - Message type indicators
  - Touch feedback
  - Conditional styling based on read status

### RecipientSelector Component
- Standalone recipient selection interface
- **Props**:
  - `onSelect` - Callback when user selected
  - `onCancel` - Callback for cancel action
- **Features**:
  - Live search with debouncing
  - Role-based filtering
  - User count display
  - Empty states
  - Loading states
  - Scrollable user list
  - Help text at bottom

## API Integration

### API Endpoints Used
- `GET /api/messages?type={received|sent}` - Get messages list
- `GET /api/messages/:id` - Get single message
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read
- `DELETE /api/messages/:id` - Delete message
- `GET /api/users?search=&role=&limit=` - Search users

### API Helper Functions
```typescript
apiHelpers.getMessages(type, params)     // Get messages list
apiHelpers.getMessage(id)                // Get single message
apiHelpers.sendMessage(data)             // Send message
apiHelpers.markMessageRead(id)           // Mark as read
apiHelpers.deleteMessage(id)             // Delete message
apiHelpers.getUsers(params)              // Search users
```

## Data Structure

### Message Object
```typescript
{
  id: string;
  subject?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}
```

### User Object
```typescript
{
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}
```

## User Flows

### Viewing Messages
1. Navigate to Messages tab
2. View received/sent messages in respective tabs
3. See unread count on tab
4. Pull to refresh for new messages
5. Tap message card to view details

### Reading a Message
1. Tap on message card from inbox
2. View full message details
3. Message automatically marked as read (if received)
4. Can reply or delete (if received)

### Sending a Message
1. Tap floating action button or "Compose Message"
2. Search and select recipient
3. Optionally add subject
4. Type message content (min 10 chars)
5. Tap "Send Message"
6. Confirmation shown, navigate back to inbox

### Replying to a Message
1. Open message detail
2. Tap "Reply" button
3. Recipient pre-selected
4. Compose and send reply

## Permissions & Security

### Message Access
- Users can only view messages where they are sender or receiver
- Proper authentication required for all operations

### Delete Operation
- Only receivers can delete messages
- Confirmation dialog before deletion
- Soft delete (could be changed to hard delete)

### Mark as Read
- Only receivers can mark messages as read
- Automatically triggered on message view

## Validation Rules

### Compose Message
- Recipient: Required
- Subject: Optional, any length
- Content: Required, minimum 10 characters
- All fields trimmed before submission

## State Management

### React Query Keys
- `['messages', type]` - Messages list by type
- `['message', id]` - Single message detail
- `['users', search, role]` - Users list for recipient selection

### Invalidation Strategy
- After sending: Invalidate `['messages']`
- After marking read: Invalidate `['messages']` and `['message', id]`
- After deleting: Invalidate `['messages']`, navigate back

## UI/UX Features

### Smart Date Formatting
- "Just now" - Less than 1 minute ago
- "5m ago" - Minutes ago (< 1 hour)
- "2h ago" - Hours ago (< 24 hours)
- "Yesterday" - Exactly 1 day ago
- "3d ago" - Days ago (< 7 days)
- "Jan 15" - Week or more ago

### Visual Indicators
- Blue dot for unread messages
- Blue border/background for unread cards
- "New" badge on unread message details
- Character count with validation color
- Loading spinners during operations
- Success/error alerts

### Accessibility
- Touch targets sized appropriately
- Clear visual hierarchy
- Descriptive labels and help text
- Error messages and validation feedback

## Navigation

### Routes
- `/messages` - Messages inbox
- `/messages/[id]` - Message detail
- `/messages/compose` - Compose new message
- `/messages/compose?userId=xxx` - Compose with pre-selected user

### Navigation Flow
```
Inbox → Detail → Reply/Delete
       ↓
    Compose → Select Recipient → Write Message → Send → Inbox
```

## Future Enhancements

### Potential Features
1. **Attachments** - Support file uploads
2. **Message threading** - Group related messages
3. **Bulk operations** - Mark multiple as read, delete multiple
4. **Search/filter** - Search message content
5. **Draft messages** - Save unsent messages
6. **Message notifications** - Real-time push notifications
7. **Read receipts** - Show when message was read
8. **Message archive** - Archive instead of delete
9. **Rich text** - Formatted message content
10. **Group messages** - Send to multiple recipients

## Testing Checklist

### Inbox Screen
- [ ] Received tab shows received messages
- [ ] Sent tab shows sent messages
- [ ] Unread count accurate
- [ ] Pull to refresh works
- [ ] Empty states display correctly
- [ ] FAB navigates to compose
- [ ] Unread messages highlighted

### Detail Screen
- [ ] Message loads correctly
- [ ] Auto mark as read works
- [ ] Reply navigates with recipient
- [ ] Delete shows confirmation
- [ ] Delete removes message
- [ ] Back button works
- [ ] Permissions enforced

### Compose Screen
- [ ] Recipient search works
- [ ] Role filters work
- [ ] User selection works
- [ ] Pre-selected user (URL param) works
- [ ] Subject optional
- [ ] Content validation works
- [ ] Character count accurate
- [ ] Send button disabled when invalid
- [ ] Success message shows
- [ ] Navigation after send works

## Performance Considerations

- Uses React Query for efficient data caching
- Pull-to-refresh for manual data updates
- Optimistic updates not implemented (could be added)
- Pagination support in API (not used in mobile yet)
- Debounced search in recipient selector
- Lazy loading of message details

## Notes

- Messages are private 1-to-1 only (no group messaging yet)
- No real-time updates (requires manual refresh)
- Notifications created on send (web API handles this)
- Mobile app matches web functionality closely
- Follows EduNexus design system and patterns
