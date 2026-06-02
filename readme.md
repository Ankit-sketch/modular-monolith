## ## Learnings

1. Middleware → 2. Guards → 3. Interceptors (Pre-handler) → 4. Pipes → Controller Handler → 5. Interceptors (Post-handler).

2. Middleware Middleware is a function called before the route handler. It is essentially the same as Express middleware and has full access to the request and response objects.
   Best For: Tasks that don't need to know which specific route handler is being called (e.g., logging, body parsing, or general header manipulation).Key Trait: It is "context-unaware"; it doesn't know which class or method will be executed next.

3. Guard Guards have a single responsibility: determining whether a request should be allowed to proceed to the route handler.
   Best For: Authorization and authentication (e.g., checking user roles or JWT validity).Key Trait: Unlike middleware, guards have access to the ExecutionContext, allowing them to see metadata like @Roles() on the handler.

4. Interceptor Interceptors are inspired by Aspect-Oriented Programming (AOP). They can execute logic both before the method runs and after it returns a result.
   Best For:Transforming the response (e.g., wrapping all results in a { data: ... } object).Logging execution time or implementing caching.Handling timeouts or modifying exceptions.Key Trait: They wrap the entire execution process.

5. Pipe Pipes operate on the arguments of a route handler just before the method is invoked.
   Best For:Validation: Ensuring the incoming data (like body or query) meets specific criteria (e.g., using class-validator).Transformation: Converting data to a desired format (e.g., changing a string ID from a URL into a number).Key Trait: If a pipe throws an exception, the controller method is never executed

## Key Differences :-

## Custom Pipe: Best for unique logic (e.g., checking a value against a database or specific business rules).

## Exception Factory: Best for reformatting standard class-validator error messages into a specific JSON structure.

## IMPORTANT RULE

## AuthModule:

✅ CAN use UsersModule

## UsersModule:

❌ should NOT depend on AuthModule

##

Client
↓
AuthController
↓
AuthService
↓
UsersService
↓
UsersRepository
↓
Prisma
↓
Database

## AuthModule can use exported things from UsersModule

Application/security/workflow layers
can depend on core business domains.

Core domains should remain independent.

## API versioning =>

Understand this in this way that you have a frontend web app using v1/user, now let's say for the same api we wat to add extra parameters or it need to return extra values, if you directly do it in backend and in the same v1/user api then it will break, why it will break ? Obviously your backend application is already deployed, now you need to do the development in frontend then deploy it again. But in real life it is not simple as that because you might have lot of apis or changes and frontend needs to perform testing before deployment.
Also, it might be the case that your api is used by multiple frontends now what you will do you don't have enough time to make changes in all three apps at same time and Let's say one app needs these changes urgent, now you will have to deploy backend. Now, one app will run fine but other two will start Breaking.
So, till the time other two apps also deployed to server they need to use the v1/user api without breaking.

So, we will make new v2/user api, in this way one app can use this and until all clients migrate to newer version they will still use v1/user.

## GOOD Minimal Swagger Usage

Controller Grouping
@ApiTags('Auth')

JWT Auth
@ApiBearerAuth()

Sometimes Route Summary
@ApiOperation({
summary: 'Login user',
})

## Migrations=>

# Prisma Migrations & Generated Client Notes

## What Are Database Migrations?

Database migrations are basically:

> Version control for database schema.

Just like Git tracks changes in source code, migrations track changes in database structure over time.

Migrations help safely evolve production databases without losing existing data.

---

# Why Migrations Are Needed

Applications continuously evolve.

Example:

Initial database schema:

```text id="7rqv0x"
users
  - id
  - email
```

Later requirements change:

```text id="d3l2lf"
users
  - id
  - email
  - password
```

Without migrations:

- developers manually update databases
- environments become inconsistent
- production drift happens
- applications crash due to schema mismatch

Migrations solve this problem by creating reproducible schema history.

---

# Migration History Concept

Example migration sequence:

```text id="m4n8uh"
001_create_users
002_add_password
003_add_roles
```

Each migration represents one incremental database change.

This provides:

- schema versioning
- environment synchronization
- reproducible setups
- safe deployments

---

# Important Understanding

Migrations generally DO NOT delete existing data.

They incrementally modify schema.

Example migration:

```sql id="pf9m1i"
ALTER TABLE users
ADD COLUMN password TEXT;
```

This preserves all existing rows.

---

# Example

Before migration:

| id  | email                                   |
| --- | --------------------------------------- |
| 1   | [test@gmail.com](mailto:test@gmail.com) |

After migration:

| id  | email                                   | password |
| --- | --------------------------------------- | -------- |
| 1   | [test@gmail.com](mailto:test@gmail.com) | NULL     |

Existing data remains intact.

---

# When Data Loss Can Happen

Data loss only occurs if destructive operations are performed, such as:

```sql id="d0d6zk"
DROP TABLE users;
```

or

```sql id="ml8mr4"
DROP COLUMN email;
```

or incompatible type changes.

Modern ORMs like Prisma warn before destructive changes.

---

# Prisma Migration Commands

## Development Workflow

```bash id="cgb9l3"
npx prisma migrate dev
```

This command:

- compares schema changes
- creates migration files
- applies migrations locally
- regenerates Prisma client
- updates migration history

This command is optimized for development workflow.

---

# Why `migrate dev` Is Called "dev"

The `dev` means:

> Development-oriented migration workflow.

It is designed for:

- local development
- fast iteration
- schema experimentation

It may:

- create migrations automatically
- ask interactive questions
- reset local DB in conflicts

This is acceptable in development, but unsafe for production.

---

# Production Workflow

Production should use:

```bash id="7m3f9m"
npx prisma migrate deploy
```

This command:

- ONLY applies existing committed migrations
- does NOT create new migrations
- does NOT reset databases
- is production-safe

---

# Important Distinction

## `prisma migrate dev`

Purpose:

```text id="xt6g5x"
Create + apply migrations during development
```

---

## `prisma migrate deploy`

Purpose:

```text id="xw1j1f"
Safely apply already-reviewed migrations in production
```

---

# Very Important Production Principle

Production should NEVER:

- auto-create schema changes
- infer new migrations
- experiment with database structure

Production should ONLY:

- apply reviewed migration history

---

# Prisma Folder Structure

Recommended structure:

```text id="ln3ut9"
project/

  prisma/
    schema.prisma
    migrations/

  src/
    generated/
      prisma/

    modules/
    infrastructure/
    shared/
```

---

# Why `prisma/` Usually Stays Outside `src/`

Because:

- schema
- migrations
- database evolution

are infrastructure concerns, not runtime application logic.

Keeping them outside `src` creates clean separation of concerns.

---

# Prisma Generated Client

Generated using:

```bash id="jlwm5v"
npx prisma generate
```

This creates runtime Prisma client code.

Example output location:

```text id="9kr94p"
src/generated/prisma
```

or:

```text id="1mim6x"
node_modules/@prisma/client
```

---

# Should Generated Prisma Client Be Committed?

Usually NO.

Generated code is reproducible.

Just like `node_modules`, it can always be regenerated.

Source of truth is:

- schema.prisma
- migrations
- package.json

NOT generated runtime code.

---

# Why Generated Client Is Added To `.gitignore`

Because it can always be recreated using:

```bash id="8rx6ya"
npx prisma generate
```

Generated code should not be manually maintained.

---

# Team Collaboration Workflow

When another developer clones the project:

## 1. Install dependencies

```bash id="nhklns"
npm install
```

---

## 2. Setup `.env`

Configure environment variables.

---

## 3. Generate Prisma client

```bash id="r6o1d3"
npx prisma generate
```

---

## 4. Apply migrations

```bash id="ozqmsd"
npx prisma migrate dev
```

---

## 5. Start application

```bash id="49psfd"
npm run start:dev
```

---

# Recommended package.json Scripts

```json id="0o4dws"
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

Optional automation:

```json id="br8ab7"
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

This automatically regenerates Prisma client after `npm install`.

---

# Important Concept About Generated Client

Generated Prisma client MUST exist in production because application runtime depends on it.

Production SHOULD generate Prisma client.

What production SHOULD NOT do is:

```text id="9x2dzd"
auto-create migrations or schema changes
```

---

# Correct Production Flow

## During Build / CI

```bash id="3p2m9d"
npx prisma generate
```

Safe in production.

This only generates runtime client code.

---

## During Deployment

```bash id="rmeq9f"
npx prisma migrate deploy
```

Safe production migration application.

---

# What Production Should Never Run

```bash id="6f9y0s"
npx prisma migrate dev
```

because it is intended for development workflow only.

---

# Core Migration Philosophy

Migrations exist to:

- safely evolve databases
- preserve production data
- synchronize environments
- track schema history
- support reproducible deployments

In simple words:

> Migrations are Git commits for your database structure.

# CORS, Browser Security & Postman Notes

## What Is CORS?

CORS stands for:

> Cross-Origin Resource Sharing

It is a browser security mechanism that controls which frontend domains are allowed to access backend APIs.

---

# Why CORS Exists

Browsers enforce something called:

> Same-Origin Policy

This prevents malicious websites from making unauthorized requests using a user's authenticated session.

---

# Example Scenario

Suppose a user is logged into:

```text id="v6knzr"
https://bank.com
```

Now the user visits:

```text id="p8jqzd"
https://evil.com
```

Without browser security restrictions, `evil.com` could secretly make requests to the bank API using the user's cookies/session.

CORS exists to prevent this.

---

# How CORS Works

When frontend sends a request, browser automatically sends:

```http id="6t7q2s"
Origin: https://frontend.com
```

Backend responds with:

```http id="65e5p8"
Access-Control-Allow-Origin
```

If frontend domain is allowed:

- browser allows response

If not allowed:

- browser blocks access to response

---

# Important Understanding

CORS is enforced by:

```text id="0p5ggf"
BROWSERS
```

NOT by backend itself.

This is the MOST important concept.

---

# Why Postman Works Without CORS

Postman is NOT a browser.

It:

- sends raw HTTP requests
- does not enforce browser security rules
- ignores CORS completely

That is why:

- browser may show CORS error
- Postman still works perfectly

---

# Very Important Concept

Backend may actually return:

```http id="lnm40i"
200 OK
```

BUT browser can still block frontend JavaScript from accessing the response due to missing CORS headers.

So:

- request reached backend
- backend responded
- browser blocked frontend access

---

# CORS Is NOT Real API Security

CORS only protects browser-based requests.

It DOES NOT protect against:

- Postman
- curl
- backend servers
- bots
- scripts

Because those are not browser-originated requests.

---

# Real API Protection Requires

- JWT authentication
- API keys
- authorization
- rate limiting
- input validation

CORS alone is NOT enough.

---

# NestJS CORS Setup

Example:

```ts id="mnv3vx"
app.enableCors({
  origin: ["http://localhost:3000", "https://myfrontend.com"],

  credentials: true,
});
```

This allows requests only from specified frontend domains.

---

# Dynamic CORS Example

```ts id="xan1k7"
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = ["https://app.com", "https://admin.app.com"];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});
```

---

# Important Distinction

## Browser Requests

Affected by:

- CORS
- same-origin policy
- browser security restrictions

---

## Postman / curl / Backend Requests

NOT affected by browser security restrictions.

---

# Most Important Takeaway

CORS is:

> Browser security policy

NOT:

- backend authentication
- full API protection
- server-side authorization

Postman works because:

- it is not a browser
- it does not enforce browser security rules

Real backend security still requires:

- JWT
- API keys
- authorization
- validation
- rate limiting

## API DESIGN =>

## https://www.youtube.com/watch?v=XvFmUE-36Kc&list=PL_c9BZzLwBRIHUNeoywVJXViXGEsk6PDr

## Example Collection

POST /api/posts/{id}/comments # Create comment
GET /api/posts/{id}/comments # Get post comments
GET /api/comments/{id} # Get comment by ID
PUT /api/comments/{id} # Replace entire comment
PATCH /api/comments/{id} # Partial update comment
DELETE /api/comments/{id} # Delete comment
POST /api/comments/{id}/reply # Reply to comment
GET /api/comments/{id}/replies # Get comment replies

1. `POST /api/posts/{id}/comments` - Creates a new comment on a specific post
2. `GET /api/posts/{id}/comments` - Retrieves all comments for a specific post
3. `GET /api/comments/{id}` - Retrieves a single comment by its ID
4. `PUT /api/comments/{id}` - Completely replaces an existing comment with new data. This effectively is used to update data, but the flow is that the client would request the comment information. Allow the user to change it, and then send back the updated new comment information, completely replacing the old data. It would still have the same ID in the database.

Also worth knowing that if you have a complex object you are modifying you send back the entire object. If you just send back certain fields it will delete everything not sent back or potentially cause an error.

This operation should be **idempotent**. If you execute it 100 times you still have the same result. Compare this to an insert or delete.

5. `PATCH /api/comments/{id}` - Updates only specific fields of an existing comment
6. `DELETE /api/comments/{id}` - Removes a comment from the system
7. `POST /api/comments/{id}/reply` - Creates a reply to an existing comment
8. `GET /api/comments/{id}/replies` - Retrieves all replies for a specific comment

## Status Codes

The server has the ability to provide a variety of status codes.

These are grouped in to general categories:(https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

1. Informational responses (`100` – `199`)
2. Successful responses (`200` – `299`)
3. Redirection messages (`300` – `399`)
4. Client error responses (`400` – `499`)
5. Server error responses (`500` – `599`)

## When using PUT, you must send the complete data payload; leaving fields out will typically result in those fields being deleted or set to null on the server. When using PATCH, you only send the specific fields you want to change, leaving everything else untouched.

## Rate Limiting

Limit how many requests a client can make in time window
Different APIs need different limits, so we use use route level limits
Example:
| API | Limit |
| --------------- | ------- |
| Register | strict |
| Login. | medium |
| Public GET APIs |relaxed |
IMPORTANT : Rate limiting usually works using: IP address

## BUT Important Production Insight

IP-based limiting is: not perfect because:
VPNs
proxies
shared networks
NAT
botnets

But still VERY useful first defense.

## Enterprise-Level Protection Usually Adds

CAPTCHA
email verification
device fingerprinting
bot detection
Redis distributed rate limits
Cloudflare/WAF protection

## Example Real Protection Stack

Cloudflare
↓
API Gateway
↓
Rate limiting
↓
JWT/Auth
↓
CAPTCHA
↓
Business validation
↓
Database constraints

## What It Does NOT Fully Stop

❌ distributed botnets
❌ rotating VPN IPs
❌ sophisticated attackers
❌ large-scale DDoS attacks
For those:
Cloudflare
WAF
CDN
bot detection
CAPTCHA
infra-level mitigation

become important.

## IMPORTANT Production Architecture

In large systems: rate limiting often happens at API gateway
Examples:
NGINX
Cloudflare
Kong
AWS API Gateway
Because: blocking malicious traffic before app server is more efficient.

## forRootAsync (Asynchronous) vs forRoot (Synchronous)

Use forRootAsync when your configuration depends on external factors, such as database credentials from a secret manager, values loaded from a .env file via ConfigService, or conditional runtime logic.

Use forRoot when your configuration values are hardcoded or ready immediately before the NestJS application context finishes starting up.

## Remember that i nest js because it is a framework so almost everything is well written or strucutred inside the framework. If you see how we are importing the env variables then there is already configservice module which is handling all variables.
