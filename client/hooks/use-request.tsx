import axios from "axios";
import { useState } from "react";

interface IUseRequest {
  url: string;
  method: string;
  body: {};
  onSuccess: (data: any) => void;
}

export default ({ url, method, body, onSuccess }: IUseRequest) => {
  const [errors, setErrors] = useState<any>(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await (axios as any)[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err: any) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((e: any) => (
              <li key={e.message}>{e.message}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  return { doRequest, errors };
};
