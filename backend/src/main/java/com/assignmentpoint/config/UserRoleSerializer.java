package com.assignmentpoint.config;

import com.assignmentpoint.entity.User;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class UserRoleSerializer extends StdSerializer<User.UserRole> {
    public UserRoleSerializer() {
        super(User.UserRole.class);
    }

    @Override
    public void serialize(User.UserRole value, JsonGenerator gen, com.fasterxml.jackson.databind.SerializerProvider provider)
            throws IOException {
        gen.writeString(value.name().toLowerCase());
    }
}
