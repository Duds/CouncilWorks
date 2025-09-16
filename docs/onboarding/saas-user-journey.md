# SaaS Onboarding User Journey Design

## 🎯 Ideal SaaS Onboarding Flow (Based on Canva, Miro, etc.)

### **Phase 1: Discovery & Sign-Up**
1. **Landing Page** → Clear value proposition
2. **Google OAuth Sign-In** → Frictionless authentication
3. **Domain Detection** → Auto-detect company domain
4. **Onboarding Choice** → Trial options

### **Phase 2: Account Setup**
1. **Organisation Creation** → First user becomes admin
2. **Trial Selection** → Blank vs Sample Data
3. **Role Assignment** → Admin privileges
4. **Welcome Tour** → Feature introduction

### **Phase 3: Team Building**
1. **Invite Team Members** → Email invitations
2. **Role Management** → Assign appropriate roles
3. **Collaboration Setup** → Team workflows

## 🚀 Implementation Strategy

### **1. OAuth User Creation Flow**
```typescript
// New OAuth users get proper onboarding
if (account?.provider && !existingUser) {
  // Create user with proper defaults
  const newUser = await prisma.user.create({
    data: {
      email: profile.email,
      name: profile.name,
      image: profile.picture,
      role: 'ADMIN', // First user becomes admin
      isActive: true,
      // Organisation will be created in onboarding
    }
  });
}
```

### **2. Onboarding Pages**
- `/onboarding/welcome` → Welcome & domain detection
- `/onboarding/organisation` → Create organisation
- `/onboarding/trial` → Choose trial type
- `/onboarding/complete` → Setup complete

### **3. Trial Options**
- **Blank Account**: Start fresh
- **Sample Data**: Pre-populated with demo assets
- **Import Data**: Upload existing data

### **4. User Invitation System**
- Domain-based invitations
- Role assignment
- Email templates
- Invitation tracking

## 📊 Success Metrics
- Time to first value
- User activation rate
- Team invitation rate
- Trial to paid conversion
