import { useFieldExtension, Wrapper } from "@graphcms/app-sdk-react";
import { InputError } from "@hygraph/baukasten";
import { useEffect, useState } from "react";

function GuardianField() {
    const sdkProps = useFieldExtension();
    const [hasAuthors, setHasAuthors] = useState(false);

    useEffect(() => {
        // we can set any value, as long as its invalid
        // e.g the declaration says this is a string field, but, we set its value to a number to make it invalid as soon as its rendered
        // later on we can choose to set a valid value
        sdkProps.onChange(1);
    }, []);

    useEffect(() => {
        let unsubscriber: any = undefined;
        sdkProps.form
            .subscribeToFormState(
                ({ values }) => {
                    // check if authors fields has any value
                    if (values["authors"].connect.length > 0) {
                        setHasAuthors(true);
                        // if it does, set the value to a valid value (string)
                        sdkProps.onChange("validate");
                    } else {
                        setHasAuthors(false);
                        sdkProps.onChange(1);
                    }
                },
                { values: true }
            )
            .then((unsub) => {
                unsubscriber = unsub;
            });

        return () => {
            unsubscriber?.();
        };
    }, []);

    return hasAuthors ? <div>Valid</div> : <InputError>Invalid</InputError>;
}

export default function App() {
    return (
        <Wrapper>
            <GuardianField />
        </Wrapper>
    );
}
