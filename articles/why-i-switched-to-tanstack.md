---
title: "Why I Switched to TanStack"
category: "reactjs"
date: "21-08-2025"
---

# Why I Switched to TanStack

I'm a perfectionist! I like structure, rules, and strictness — whatever makes things more predictable. I like tools that help me become a better version of myself by giving me useful feedback whenever something seems wrong, so I can improve.

As a web developer, my work is primarily with JavaScript. But this language is so forgiving and flexible that, in many situations, it can hurt more than it helps — especially if you’re working in a team or in an environment where mistakes are likely.

That's why I, like many other developers, prefer JavaScript's safer and stricter cousin: **TypeScript** ✨

After developing real-world apps with both JS and TS, and learning TypeScript and its powers along the way, I realized a few things:
1. TypeScript is the GOAT (**G**reatest **O**f **A**ll **T**ime).
2. Tools MATTER! They’re not, and shouldn’t be, the main concern, but that shouldn’t negate their importance.

When it comes to tools, some of them are just different: the DX they provide, their impact on UX, and other factors. Sometimes these differences make it a wise decision to switch tools.

That exact same thing happened to me, not once, not twice, but multiple times. Not that I'm playing with all these tools, but I’m exploring the options I have to see which combinations give me the power to build anything I want, quickly, and with confidence that it will be stable and reliable.

After working on multiple real-world projects, I noticed something. I tried to make abstractions whenever I found something hard or repetitive. That intention was good in itself, but those abstractions had a lot of problems:
- They weren't appropriate
- They weren't documented
- They weren't type-safe
- They weren't customizable
- They only made sense in the moment
- They had many issues and lacked features that real apps need

Little by little, I became more aware of the ecosystem of tools that React offers. Eventually, I realized that most of the problems I encountered in real projects already had multiple solutions — tools and libraries I could use to simplify the process and improve the quality of my projects.

By experimenting and educating myself about these new tools, I started refactoring parts of an app I had built and suddenly saw the difference. Those new tools were just different — they were game-changing!

I feel compelled to introduce those _tools_ to you. They have the power to change the way you develop React web apps and give you the speed and confidence to build projects with ease.

## What is TanStack?

**TanStack**, as they define it themselves:

> **High-quality open-source software for web developers**
> 
> Headless, type-safe, & powerful utilities for Web Applications, Routing, State Management, Data Visualization, Datagrids/Tables, and more.
> 
> \- [TanStack Homepage](https://tanstack.com/)

At the time of this writing, the TanStack family has **12** libraries,  
6 of which are **stable** and ready for production.

The libraries I’m most excited about are the following:

1. **TanStack Query** – Powerful asynchronous state management, server-state utilities, and data fetching.  
2. **TanStack Form** – Headless, performant, and type-safe form state management.  
3. **TanStack Router** – Type-safe routing for React and Solid applications.  

And the thing is, nobody can capture their power or their DX in a single line.  
Because of that, I’m going to introduce all of them to you _one by one_, so you’ll understand:

- What they are  
- What problems they solve  
- How they compare to some other libraries  

So get ready for an exciting tour!  

Let the **FUN** begin! 🚀

---

## TanStack Query: Async State Made Simple

The official docs explain this library this way:

> TanStack Query (formerly known as React Query) is often described as the missing data-fetching library for web applications, but in more technical terms, it makes fetching, caching, synchronizing, and updating server state in your web applications a breeze.

Before going any further, I have to answer some questions.

### What is "State"?

> State is just the stuff your app “remembers” right now — like what’s on the screen, what’s checked, or what the user typed. It changes as people interact, and the app updates to match it.  
> – ChatGPT

And the thing is, there are multiple kinds of state!

### Server State vs Client State

We basically have two kinds of state:

1. **Client state** – Data in the user’s browser (e.g., theme, toggle’s on/off state).  
2. **Server state** – Data from a backend (e.g., posts from an API).  

Client state is the data that lives in the user’s browser.  
It could be global or local to a component, in the URL, or in `localStorage`.  
Client state is simple, predictable, and _synchronous_.  
You’d never `await` client state.  
You don’t show loading spinners or error messages for client state.  

Client state is easy — especially when you compare it to **server state management**, which is way harder.

### Challenges of Server State

Server state is totally different compared to client state.  

For example, server state:

- Is persisted remotely (not in the user’s browser).  
- Requires asynchronous APIs for fetching and updating.  
- Has a higher chance of causing problems (since it’s async and requires client/server communication).  
- Can be changed by other people without your knowledge.  
- Can potentially become "out of date" in your application if you’re not careful.  

---

And you know, I tried to make this easy. I wrote a LOT of different abstractions, _clever_ hooks, and functions. I even built a [complete library](https://www.npmjs.com/package/@gikdev/react-datapi) for this! But it just didn’t feel right.

### How does TanStack Query solve it?

So, in plain React, we’d handle server state like this:

```tsx
type UserInfo = /* ... */

function UserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [isError, setError] = useState(false)

  useEffect(() => {
    async function fetchUserInfo() {
      setLoading(true)
      
      try {
        const res = await fetch("...")
        if (!res.ok) throw new Error("...")

        const data = await res.json()
        setUserInfo(data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  if (isLoading) return "Loading..."
  if (isError) return "An error occurred!"
  if (userInfo) return `User name: ${userInfo.name}`
  return null
}
```

This code works. But do you know what problems it has?

1. **Manual loading and error states**: You have to explicitly track `isLoading` and `isError`.
2. **No caching**: Every time this component mounts, it re-fetches the data — even if we already had it before.
3. **No automatic refetching**: If the data changes on the server, the client won’t know unless you refresh or implement a manual refetch button.
4. **No request deduplication**: If two components need the same data, they’ll each send their own request — wasting bandwidth and CPU.
5. **No retries on failure**: A flaky connection? The fetch just fails. You’d have to write retry logic yourself.
6. **No background updates**: Once fetched, the data quickly gets stale unless you re-run the effect manually.
7. **Scales poorly**: With 10+ API calls, you end up duplicating the same boilerplate (`isLoading`, `isError`, `useEffect`) over and over. That’s **tedious**!

---

Now let’s compare the same logic using **TanStack Query**:

```tsx
type UserInfo = /* ... */

async function fetchUserInfo(): Promise<UserInfo> {
  const res = await fetch("...")
  if (!res.ok) throw new Error("...")
  const data = await res.json()
  return data
}

function UserInfo() {
  const { isPending, error, data: userInfo } = useQuery({
    queryKey: ["userInfo"],
    queryFn: fetchUserInfo,
  })

  if (isPending) return "Loading..."
  if (error) return "An error occurred!"
  return `User name: ${userInfo.name}`
}
```

You might say:
"OK, this has fewer lines of code — but what else does it do? Does it really solve the other problems?"

Well, this is just a small portion of what TanStack Query handles for you **out of the box**:

- ✅ **Built-in caching**: Keeps data around, so re-renders or remounts don’t always re-fetch.
- ✅ **Automatic refetching**: Refreshes data when the window is refocused, the network reconnects, or when you tell it to.
- ✅ **Request deduplication**: Multiple components requesting the same data only trigger **one fetch**.
- ✅ **Retries & exponential backoff**: Automatically retries failed requests with smart delays.
- ✅ **Background updates**: Keeps data fresh without forcing reloads or extra code.
- ✅ **Declarative API**: Removes boilerplate (`useState`, `useEffect`) and gives you a simple, consistent interface.
- ✅ **Scales beautifully**: Whether it’s 2 queries or 200, the API and logic remain consistent.

And this is just scratching the surface. ✨

I'd say, you wouldn't really understand how much good this is, unless you try it in a real project.

Moving on, state management is not the only hard part of web app development with React. We also have routing, forms, tables and so much more!

---

## TanStack Form: Forms Made Simple

Here we have a simple login form:

```tsx
const isEmailValid = () => { /* ... */ }

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    if (!isEmailValid(email)) {
      alert("Provide a valid email")
      return
    }

    // if we reach here, it means that email is valid...

    console.log({
      email,
      password,
    }) // suppose here we're doing something important with those data
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit()
    }}>
      <div>
        <label>Email:</label>
        <input type="email" />
      </div>

      <div>
        <label>Password:</label>
        <input type="password" />
      </div>

      <button type="submit">Log in</button>
    </form>
  )
}
```

You might not see the need to use a library for this.
You are right! 
For a form with 2 inputs, it's _OK_ to do it this way.

But you know what the problem is?  
It's that forms in real apps are way much harder.  
Now you might ask: why?

Let's see:
- What if your form had 10+ inputs?  
  - For example, at my work, I had worked on forms that had 15+ inputs in them. They were of really different types, some were plain text, some were numbers, some were select-boxes, and so on...
- What if each input needed to have some sort of validation? 
  - For those who might not know: validation means to **make sure the data that user has given us is in the format that we expect it to be**. 
  - For example, for an age field, we'd want it to be a positive number, not a string! not a negative number!
- What if you needed to validate something asynchronously? 
  - For example, in a social media app, when a user is signing up, you need to make sure the username they're writing in the input is not currently acquired by other users 
- How'd you handle error messages? What if your app has multiple languages?
  - So in the age field example, when user is entering a negative number, we should let them know that they need to provide a positive number and a negative one is not allowed!
- How'd you make sure all forms and their fields are consistent, both visually and behaviorally? 
  - Wouldn't you need to make some components and abstractions to make your life easier and make forms faster?
  - But, what if you make the wrong type of abstractions? (this HAPPENED to me, and believe me, you DON'T WANT THIS!)

All those you read, were a portion of all the things you can and should do in forms.

And here is where **TanStack Form** comes in! It's the library I wish it was built-in into React.

So let's see the same login form example but in TanStack Form:

```tsx
```
