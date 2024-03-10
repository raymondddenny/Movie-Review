import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { toast } from "sonner";
import { db } from "~/utils/db.server";
export async function loader({ params }: LoaderFunctionArgs) {
  const data = await db.comment.findMany({
    where: { movieId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return json({ data });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const comment = formData.get("comment");
  const id = formData.get("id");

  if (!comment || !id) {
    toast.error("Invalid comment, cannot be empty");
    return json(
      { message: "Invalid comment, cannot be empty" },
      { status: 400 }
    );
  }

  const data = await db.comment.create({
    data: {
      message: comment as string,
      movieId: id as string,
    },
  });

  return json({ data });
}

export default function Comments() {
  const { id } = useParams();
  const { data } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  // TODO: add loading state
  const navigation = useNavigation();
  console.log(actionData);
  return (
    <div className="rounded-lg border p-3">
      <h1 className="text-xl font-semibold mb-5">Your Opinion</h1>
      <div>
        <Form method="POST">
          <textarea
            name="comment"
            className="w-full border border-teal-500 rounded-lg p-2"
          ></textarea>
          <input type="hidden" name="id" value={id} />

          {navigation.state === "submitting" ? (
            <button
              type="button"
              disabled
              className="bg-teal-500 px-4 py-2 rounded-lg text-white"
            >
              Loading ...
            </button>
          ) : (
            <button
              type="submit"
              className="bg-teal-500 px-4 py-2 rounded-lg text-white"
            >
              Send Comment
            </button>
          )}
        </Form>
        <div className="mt-5 flex flex-col gap-y-3 ">
          {data.map((comment) => (
            <div key={comment.id}>
              <p>{comment.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
