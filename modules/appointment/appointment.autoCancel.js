const Appointment = require("./appointment.model");


// =====================================================
// CONVERT TIME TO MINUTES
// =====================================================

const convertTimeToMinutes = (timeString) => {

    if (!timeString) {
        return null;
    }

    const timeMatch = String(timeString)
        .trim()
        .match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i
        );

    if (!timeMatch) {
        return null;
    }

    let hour = parseInt(
        timeMatch[1],
        10
    );

    const minute = parseInt(
        timeMatch[2],
        10
    );

    const period = timeMatch[3];

    if (
        Number.isNaN(hour) ||
        Number.isNaN(minute) ||
        minute < 0 ||
        minute > 59
    ) {
        return null;
    }


    // =================================================
    // 12-HOUR FORMAT
    // =================================================

    if (period) {

        if (
            hour < 1 ||
            hour > 12
        ) {
            return null;
        }

        const upperPeriod =
            period.toUpperCase();

        if (hour === 12) {
            hour = 0;
        }

        if (
            upperPeriod === "PM"
        ) {
            hour += 12;
        }

    }


    // =================================================
    // 24-HOUR FORMAT
    // =================================================

    else {

        if (
            hour < 0 ||
            hour > 23
        ) {
            return null;
        }

    }


    return (
        hour * 60 +
        minute
    );
};


// =====================================================
// CREATE APPOINTMENT DATE + TIME
// =====================================================

const getAppointmentDateTime = (
    date,
    time
) => {

    if (!date || !time) {
        return null;
    }


    // -------------------------------------------------
    // DATE
    // -------------------------------------------------

    const dateParts =
        String(date)
            .trim()
            .split("-");


    if (dateParts.length !== 3) {
        return null;
    }


    const year =
        parseInt(
            dateParts[0],
            10
        );

    const month =
        parseInt(
            dateParts[1],
            10
        );

    const day =
        parseInt(
            dateParts[2],
            10
        );


    if (
        Number.isNaN(year) ||
        Number.isNaN(month) ||
        Number.isNaN(day)
    ) {
        return null;
    }


    // -------------------------------------------------
    // TIME
    // -------------------------------------------------

    const minutes =
        convertTimeToMinutes(time);


    if (minutes === null) {
        return null;
    }


    const hours =
        Math.floor(
            minutes / 60
        );

    const remainingMinutes =
        minutes % 60;


    // -------------------------------------------------
    // LOCAL DATE/TIME
    // -------------------------------------------------

    const appointmentDateTime =
        new Date(
            year,
            month - 1,
            day,
            hours,
            remainingMinutes,
            0,
            0
        );


    if (
        Number.isNaN(
            appointmentDateTime.getTime()
        )
    ) {
        return null;
    }


    return appointmentDateTime;
};


// =====================================================
// AUTOMATICALLY CANCEL EXPIRED APPOINTMENTS
// =====================================================

const autoCancelExpiredAppointments =
    async () => {

        try {

            const appointments =
                await Appointment.find({
                    status: {
                        $in: [
                            "pending",
                            "confirmed"
                        ]
                    }
                });


            if (
                appointments.length === 0
            ) {
                return;
            }


            const now =
                new Date();


            const expiredAppointmentIds =
                [];


            for (
                const appointment
                of appointments
            ) {

                const appointmentDateTime =
                    getAppointmentDateTime(
                        appointment.date,
                        appointment.time
                    );


                // Invalid date/time:
                // leave appointment unchanged
                if (
                    !appointmentDateTime
                ) {
                    continue;
                }


                if (
                    appointmentDateTime <= now
                ) {

                    expiredAppointmentIds.push(
                        appointment._id
                    );

                }

            }


            if (
                expiredAppointmentIds.length === 0
            ) {
                return;
            }


            const result =
                await Appointment.updateMany(
                    {
                        _id: {
                            $in:
                                expiredAppointmentIds
                        },

                        status: {
                            $in: [
                                "pending",
                                "confirmed"
                            ]
                        }
                    },

                    {
                        $set: {
                            status:
                                "cancelled"
                        }
                    }
                );


            console.log(
                `Auto-cancelled ${result.modifiedCount} expired appointment(s).`
            );


        } catch (error) {

            console.error(
                "Automatic appointment cancellation error:",
                error.message
            );

        }

    };


// =====================================================
// START AUTOMATIC CANCELLATION SYSTEM
// =====================================================

const startAppointmentAutoCancel =
    () => {

        // -------------------------------------------------
        // Run immediately when server starts
        // -------------------------------------------------

        autoCancelExpiredAppointments();


        // -------------------------------------------------
        // Check every 30 seconds
        // -------------------------------------------------

        const interval =
            setInterval(
                autoCancelExpiredAppointments,
                30 * 1000
            );


        console.log(
            "Appointment auto-cancellation system started."
        );


        return interval;
    };


module.exports = {
    autoCancelExpiredAppointments,
    startAppointmentAutoCancel
};