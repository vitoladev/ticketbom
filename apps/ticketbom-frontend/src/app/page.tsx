/* eslint-disable @next/next/no-img-element */
'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from '@ticketbom/ui-kit/ui';

export default function Home() {
  return (
    <main>
      <div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Upcoming Events
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Check out our upcoming events and join us!
          </p>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tech Conference 2023</CardTitle>
              <CardDescription>
                Join us for the annual tech conference in San Francisco.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    June 1-3, 2023
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    San Francisco, CA
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Learn More</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
