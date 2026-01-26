# Messages System - Quick Start Guide

## File Structure

```
apps/mobile/
├── app/
│   └── messages/
│       ├── index.tsx          # Inbox screen (received/sent tabs)
│       ├── [id].tsx           # Message detail screen
│       └── compose.tsx        # Compose message screen
└── components/
    └── messages/
        ├── MessageCard.tsx    # Message list item component
        └── RecipientSelector.tsx  # User selection component
```

## Navigation

### Access Messages Inbox
```typescript
router.push('/messages')
```

### View Message Detail
```typescript
router.push('/messages/123')  // where 123 is message ID
```

### Compose New Message
```typescript
router.push('/messages/compose')
```

### Compose with Pre-selected Recipient
```typescript
router.push('/messages/compose?userId=456')  // where 456 is user ID
```

## Usage Examples

### Using MessageCard Component
```typescript
import MessageCard from '@/components/messages/MessageCard';

<MessageCard
  message={messageObject}
  type="received"  // or "sent"
  onPress={() => router.push(`/messages/${message.id}`)}
/>
```

### Using RecipientSelector Component
```typescript
import RecipientSelector from '@/components/messages/RecipientSelector';

<RecipientSelector
  onSelect={(user) => {
    setSelectedUser(user);
    setShowSelector(false);
  }}
  onCancel={() => router.back()}
/>
```

## API Calls

### Get Messages
```typescript
const { data } = useQuery({
  queryKey: ['messages', 'received'],
  queryFn: async () => {
    const response = await apiHelpers.getMessages('received');
    return response.data;
  },
});

// Access data
const messages = data?.messages || [];
const unreadCount = data?.unreadCount || 0;
```

### Get Single Message
```typescript
const { data: message } = useQuery({
  queryKey: ['message', id],
  queryFn: async () => {
    const response = await apiHelpers.getMessage(id);
    return response.data;
  },
});
```

### Send Message
```typescript
const sendMutation = useMutation({
  mutationFn: (data) => apiHelpers.sendMessage(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['messages'] });
    router.back();
  },
});

// Send
sendMutation.mutate({
  receiverId: 'user-id',
  subject: 'Optional Subject',
  content: 'Message content here',
});
```

### Mark as Read
```typescript
const markReadMutation = useMutation({
  mutationFn: (id) => apiHelpers.markMessageRead(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['messages'] });
  },
});

markReadMutation.mutate(messageId);
```

### Delete Message
```typescript
const deleteMutation = useMutation({
  mutationFn: (id) => apiHelpers.deleteMessage(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['messages'] });
    router.back();
  },
});

deleteMutation.mutate(messageId);
```

### Search Users
```typescript
const { data } = useQuery({
  queryKey: ['users', searchQuery, roleFilter],
  queryFn: async () => {
    const params = {
      search: searchQuery,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      limit: '100',
    };
    const response = await apiHelpers.getUsers(params);
    return response.data;
  },
});

const users = data?.users || [];
```

## Key Features Implemented

### Messages Inbox
- ✅ Tab-based navigation (Received/Sent)
- ✅ Unread count badge
- ✅ Pull-to-refresh
- ✅ Message cards with avatars
- ✅ Smart date formatting
- ✅ Unread indicators
- ✅ Empty states
- ✅ Floating action button

### Message Detail
- ✅ Full message display
- ✅ Sender/receiver info
- ✅ Auto mark as read
- ✅ Reply button
- ✅ Delete button (received only)
- ✅ Confirmation dialogs
- ✅ Back navigation

### Compose Message
- ✅ Recipient selection
- ✅ User search
- ✅ Role filtering
- ✅ Subject input (optional)
- ✅ Content input with validation
- ✅ Character count
- ✅ Send validation
- ✅ URL parameter support
- ✅ Success feedback

## Validation Rules

| Field | Required | Min Length | Max Length | Notes |
|-------|----------|------------|------------|-------|
| Recipient | Yes | - | - | Must select a user |
| Subject | No | - | - | Optional field |
| Content | Yes | 10 chars | - | Trimmed before validation |

## Color Scheme

- **Primary Blue**: `#3B82F6` (buttons, headers, highlights)
- **Blue Background**: `bg-blue-50` (unread messages)
- **Blue Border**: `border-blue-200` (unread messages)
- **Gray Background**: `bg-gray-50` (screen background)
- **White**: Cards and content areas
- **Red**: `#EF4444` (delete button, validation errors)

## Icons Used (Ionicons)

- `mail-outline` - Empty state
- `create` - Compose FAB
- `arrow-back` - Back navigation
- `close` - Close compose
- `send` - Send button
- `arrow-undo-outline` - Reply button
- `trash-outline` - Delete button
- `time-outline` - Timestamp
- `information-circle-outline` - Help text
- `search` - Search input
- `people-outline` - Users empty state
- `chevron-forward` - User selection arrow
- `arrow-down-circle-outline` - Received indicator
- `arrow-up-circle-outline` - Sent indicator
- `document-text-outline` - Subject indicator

## State Management

### Query Keys
```typescript
['messages', type]          // Messages list (type: 'received' | 'sent')
['message', id]             // Single message
['users', search, role]     // Users for recipient selection
```

### Invalidation
```typescript
// After send/delete/mark read
queryClient.invalidateQueries({ queryKey: ['messages'] });

// After mark read (also invalidate detail)
queryClient.invalidateQueries({ queryKey: ['message', id] });
```

## Common Patterns

### Loading State
```typescript
if (isLoading) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-gray-600">Loading...</Text>
    </View>
  );
}
```

### Empty State
```typescript
<EmptyState
  icon="mail-outline"
  title="No Messages"
  message="Your inbox is empty"
  actionLabel="Compose Message"
  onAction={() => router.push('/messages/compose')}
/>
```

### Alert Dialog
```typescript
Alert.alert(
  'Delete Message',
  'Are you sure?',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: handleDelete },
  ]
);
```

## Troubleshooting

### Messages not loading
1. Check API connection
2. Verify authentication token
3. Check network logs
4. Ensure backend API is running

### Mark as read not working
1. Verify user is receiver (not sender)
2. Check API permissions
3. Ensure proper query invalidation

### Recipient selector not showing users
1. Check API response format
2. Verify search parameters
3. Check role filter values
4. Ensure users exist in database

### Send button disabled
1. Verify recipient selected
2. Check content length >= 10 characters
3. Ensure content is not just whitespace

## Performance Tips

1. **Use React Query caching** - Messages are cached automatically
2. **Invalidate queries selectively** - Only invalidate what changed
3. **Debounce search** - Already implemented in user search
4. **Limit user results** - Default limit of 100 users
5. **Optimize re-renders** - Use proper dependencies in effects

## Next Steps

1. Add the Messages tab to bottom navigation
2. Test on both iOS and Android
3. Add real-time notifications (optional)
4. Implement message attachments (optional)
5. Add message threading (optional)
